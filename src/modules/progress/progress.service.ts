import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProgressStatus, TopicLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async updateTopicProgress(userId: string, topicId: string, status: ProgressStatus) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        prerequisites: {
          include: {
            prerequisite: true,
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID "${topicId}" not found`);
    }

    // Server-side prerequisite enforcement:
    // If marking as COMPLETED, verify all prerequisites are already completed
    if (status === ProgressStatus.COMPLETED && topic.prerequisites.length > 0) {
      const prereqIds = topic.prerequisites.map((p) => p.prerequisiteId);

      const completedPrereqs = await this.prisma.userProgress.findMany({
        where: {
          userId,
          topicId: { in: prereqIds },
          status: ProgressStatus.COMPLETED,
        },
        select: { topicId: true },
      });

      const completedIds = new Set(completedPrereqs.map((p) => p.topicId));
      const uncompletedPrereqs = topic.prerequisites.filter(
        (p) => !completedIds.has(p.prerequisiteId),
      );

      if (uncompletedPrereqs.length > 0) {
        const missingTitles = uncompletedPrereqs
          .map((p) => `"${p.prerequisite.title}"`)
          .join(', ');
        throw new BadRequestException(
          `Cannot mark "${topic.title}" as completed. Missing prerequisites: ${missingTitles}`,
        );
      }
    }

    const completedAt = status === ProgressStatus.COMPLETED ? new Date() : null;

    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_topicId: { userId, topicId },
      },
      update: {
        status,
        completedAt,
      },
      create: {
        userId,
        topicId,
        status,
        completedAt,
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            level: true,
          },
        },
      },
    });

    // Record activity and update streak
    const currentStreak = await this.usersService.recordActivity(userId);

    return {
      progress,
      currentStreak,
    };
  }

  async getProgressSummary(userId: string, targetRoadmapId?: string) {
    let roadmapId = targetRoadmapId;

    if (!roadmapId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          currentTrack: {
            include: {
              roadmaps: {
                where: { isCurrent: true },
                take: 1,
              },
            },
          },
        },
      });

      if (user?.currentTrack?.roadmaps?.[0]) {
        roadmapId = user.currentTrack.roadmaps[0].id;
      }
    }

    if (!roadmapId) {
      const defaultRoadmap = await this.prisma.roadmap.findFirst({
        where: { isCurrent: true },
      });
      if (!defaultRoadmap) {
        return {
          roadmapId: null,
          overallPercentage: 0,
          totalTopics: 0,
          completedTopics: 0,
          inProgressTopics: 0,
          levelBreakdown: {},
        };
      }
      roadmapId = defaultRoadmap.id;
    }

    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        topics: {
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID "${roadmapId}" not found`);
    }

    const totalTopics = roadmap.topics.length;
    let completedCount = 0;
    let inProgressCount = 0;
    let totalEstimatedHours = 0;
    let completedHours = 0;

    const levels = [
      TopicLevel.BEGINNER,
      TopicLevel.INTERMEDIATE,
      TopicLevel.ADVANCED,
      TopicLevel.EXPERT,
    ];

    const levelStats: Record<
      string,
      { total: number; completed: number; percentage: number }
    > = {};

    levels.forEach((lvl) => {
      levelStats[lvl] = { total: 0, completed: 0, percentage: 0 };
    });

    roadmap.topics.forEach((topic) => {
      totalEstimatedHours += topic.estimatedHours || 0;
      const userProg = topic.progress[0];
      const isCompleted = userProg?.status === ProgressStatus.COMPLETED;
      const isInProgress = userProg?.status === ProgressStatus.IN_PROGRESS;

      levelStats[topic.level].total += 1;

      if (isCompleted) {
        completedCount += 1;
        completedHours += topic.estimatedHours || 0;
        levelStats[topic.level].completed += 1;
      } else if (isInProgress) {
        inProgressCount += 1;
      }
    });

    levels.forEach((lvl) => {
      const st = levelStats[lvl];
      st.percentage = st.total > 0 ? Math.round((st.completed / st.total) * 100) : 0;
    });

    const overallPercentage =
      totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return {
      roadmapId: roadmap.id,
      roadmapTitle: roadmap.title,
      overallPercentage,
      totalTopics,
      completedTopics: completedCount,
      inProgressTopics: inProgressCount,
      notStartedTopics: totalTopics - completedCount - inProgressCount,
      totalEstimatedHours,
      completedHours,
      remainingHours: Math.max(0, totalEstimatedHours - completedHours),
      byLevel: levelStats,
    };
  }

  async getRecentlyCompletedTopics(userId: string, limit = 5) {
    return this.prisma.userProgress.findMany({
      where: {
        userId,
        status: ProgressStatus.COMPLETED,
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            level: true,
            estimatedHours: true,
            milestone: {
              select: { title: true },
            },
          },
        },
      },
    });
  }

  async getCurrentTopic(userId: string) {
    const currentProgress = await this.prisma.userProgress.findFirst({
      where: {
        userId,
        status: ProgressStatus.IN_PROGRESS,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        topic: {
          include: {
            resources: true,
            milestone: { select: { title: true } },
          },
        },
      },
    });

    return currentProgress?.topic || null;
  }
}
