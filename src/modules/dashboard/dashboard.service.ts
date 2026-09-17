import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private progressService: ProgressService,
  ) {}

  async getDashboardData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        streakDays: true,
        lastActiveDate: true,
        currentTrackId: true,
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

    const activeTrack = user?.currentTrack
      ? {
          id: user.currentTrack.id,
          name: user.currentTrack.name,
          title: user.currentTrack.title,
          description: user.currentTrack.description,
        }
      : null;

    const activeRoadmap = user?.currentTrack?.roadmaps?.[0] || null;

    const [progressSummary, currentTopic, recentlyCompleted, allTracks] = await Promise.all([
      this.progressService.getProgressSummary(userId, activeRoadmap?.id),
      this.progressService.getCurrentTopic(userId),
      this.progressService.getRecentlyCompletedTopics(userId, 5),
      this.prisma.track.findMany({
        include: {
          roadmaps: {
            where: { isCurrent: true },
            take: 1,
          },
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    const tracksProgress = await Promise.all(
      allTracks.map(async (t) => {
        const rMap = t.roadmaps[0];
        const summary = rMap
          ? await this.progressService.getProgressSummary(userId, rMap.id)
          : null;
        return {
          id: t.id,
          name: t.name,
          title: t.title,
          description: t.description,
          roadmapId: rMap?.id || null,
          roadmapTitle: rMap?.title || null,
          progress: summary
            ? {
                overallPercentage: summary.overallPercentage,
                completedTopics: summary.completedTopics,
                totalTopics: summary.totalTopics,
                remainingHours: summary.remainingHours,
                byLevel: summary.byLevel,
              }
            : null,
        };
      }),
    );

    return {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        streakDays: user?.streakDays || 0,
        lastActiveDate: user?.lastActiveDate,
      },
      activeTrack,
      activeRoadmap: activeRoadmap
        ? {
            id: activeRoadmap.id,
            title: activeRoadmap.title,
            version: activeRoadmap.version,
          }
        : null,
      tracks: tracksProgress,
      progress: {
        overallPercentage: progressSummary.overallPercentage,
        completedTopics: progressSummary.completedTopics,
        totalTopics: progressSummary.totalTopics,
        remainingHours: progressSummary.remainingHours,
        byLevel: progressSummary.byLevel,
      },
      currentTopic,
      recentlyCompletedTopics: recentlyCompleted.map((p) => ({
        id: p.topic.id,
        title: p.topic.title,
        level: p.topic.level,
        milestone: p.topic.milestone?.title || null,
        completedAt: p.completedAt,
      })),
    };
  }
}
