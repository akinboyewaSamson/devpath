import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProgressStatus, TopicLevel } from '@prisma/client';
import { ProgressService } from './progress.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';

describe('ProgressService', () => {
  let progressService: ProgressService;
  let prismaService: any;
  let usersService: any;

  const mockPrismaService = {
    topic: {
      findUnique: jest.fn(),
    },
    userProgress: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      findFirst: jest.fn(),
    },
    roadmap: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockUsersService = {
    recordActivity: jest.fn().mockResolvedValue(5),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    progressService = module.get<ProgressService>(ProgressService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('updateTopicProgress - Prerequisite Validation', () => {
    it('should complete a topic when it has no prerequisites', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue({
        id: 'topic-1',
        title: 'Basic HTML',
        prerequisites: [],
      });

      mockPrismaService.userProgress.upsert.mockResolvedValue({
        id: 'prog-1',
        userId: 'user-1',
        topicId: 'topic-1',
        status: ProgressStatus.COMPLETED,
        completedAt: new Date(),
        topic: { id: 'topic-1', title: 'Basic HTML', level: TopicLevel.BEGINNER },
      });

      const result = await progressService.updateTopicProgress(
        'user-1',
        'topic-1',
        ProgressStatus.COMPLETED,
      );

      expect(result.progress.status).toBe(ProgressStatus.COMPLETED);
      expect(result.currentStreak).toBe(5);
      expect(mockUsersService.recordActivity).toHaveBeenCalledWith('user-1');
    });

    it('should complete a topic when all its prerequisites are completed', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue({
        id: 'topic-2',
        title: 'Advanced JavaScript',
        prerequisites: [
          {
            prerequisiteId: 'topic-1',
            prerequisite: { title: 'Basic JavaScript' },
          },
        ],
      });

      mockPrismaService.userProgress.findMany.mockResolvedValue([
        { topicId: 'topic-1', status: ProgressStatus.COMPLETED },
      ]);

      mockPrismaService.userProgress.upsert.mockResolvedValue({
        id: 'prog-2',
        userId: 'user-1',
        topicId: 'topic-2',
        status: ProgressStatus.COMPLETED,
        completedAt: new Date(),
        topic: { id: 'topic-2', title: 'Advanced JavaScript', level: TopicLevel.INTERMEDIATE },
      });

      const result = await progressService.updateTopicProgress(
        'user-1',
        'topic-2',
        ProgressStatus.COMPLETED,
      );

      expect(result.progress.status).toBe(ProgressStatus.COMPLETED);
    });

    it('should reject completion with BadRequestException if a prerequisite is NOT completed', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue({
        id: 'topic-3',
        title: 'NestJS Framework',
        prerequisites: [
          {
            prerequisiteId: 'topic-2',
            prerequisite: { title: 'TypeScript Fundamentals' },
          },
        ],
      });

      // User has not completed topic-2
      mockPrismaService.userProgress.findMany.mockResolvedValue([]);

      await expect(
        progressService.updateTopicProgress(
          'user-1',
          'topic-3',
          ProgressStatus.COMPLETED,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(
        progressService.updateTopicProgress(
          'user-1',
          'non-existent',
          ProgressStatus.IN_PROGRESS,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProgressSummary', () => {
    it('should calculate completion percentages accurately', async () => {
      mockPrismaService.roadmap.findUnique.mockResolvedValue({
        id: 'roadmap-1',
        title: 'Backend Roadmap',
        topics: [
          {
            id: 't-1',
            level: TopicLevel.BEGINNER,
            estimatedHours: 2,
            progress: [{ status: ProgressStatus.COMPLETED }],
          },
          {
            id: 't-2',
            level: TopicLevel.BEGINNER,
            estimatedHours: 2,
            progress: [{ status: ProgressStatus.NOT_STARTED }],
          },
          {
            id: 't-3',
            level: TopicLevel.INTERMEDIATE,
            estimatedHours: 4,
            progress: [{ status: ProgressStatus.COMPLETED }],
          },
          {
            id: 't-4',
            level: TopicLevel.ADVANCED,
            estimatedHours: 6,
            progress: [{ status: ProgressStatus.IN_PROGRESS }],
          },
        ],
      });

      const summary = await progressService.getProgressSummary('user-1', 'roadmap-1');

      expect(summary.totalTopics).toBe(4);
      expect(summary.completedTopics).toBe(2);
      expect(summary.inProgressTopics).toBe(1);
      expect(summary.overallPercentage).toBe(50);
      expect(summary.byLevel.BEGINNER.percentage).toBe(50);
      expect(summary.byLevel.INTERMEDIATE.percentage).toBe(100);
      expect(summary.byLevel.ADVANCED.percentage).toBe(0);
    });
  });
});
