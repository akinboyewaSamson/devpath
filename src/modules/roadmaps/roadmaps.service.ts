import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoadmapsService {
  constructor(private prisma: PrismaService) {}

  async getLatestByTrack(trackId: string, userId?: string) {
    const roadmap = await this.prisma.roadmap.findFirst({
      where: { trackId, isCurrent: true },
      include: {
        track: true,
        milestones: {
          orderBy: { order: 'asc' },
        },
        topics: {
          orderBy: [{ level: 'asc' }, { order: 'asc' }],
          include: {
            milestone: true,
            resources: true,
            prerequisites: {
              select: { prerequisiteId: true },
            },
            prerequisiteFor: {
              select: { topicId: true },
            },
            ...(userId && {
              progress: {
                where: { userId },
                select: { status: true, completedAt: true },
              },
            }),
          },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException(`No active roadmap found for track ${trackId}`);
    }

    return this.formatRoadmapDAG(roadmap, userId);
  }

  async getById(id: string, userId?: string) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id },
      include: {
        track: true,
        milestones: {
          orderBy: { order: 'asc' },
        },
        topics: {
          orderBy: [{ level: 'asc' }, { order: 'asc' }],
          include: {
            milestone: true,
            resources: true,
            prerequisites: {
              select: { prerequisiteId: true },
            },
            prerequisiteFor: {
              select: { topicId: true },
            },
            ...(userId && {
              progress: {
                where: { userId },
                select: { status: true, completedAt: true },
              },
            }),
          },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID "${id}" not found`);
    }

    return this.formatRoadmapDAG(roadmap, userId);
  }

  async listVersionsForTrack(trackId: string) {
    return this.prisma.roadmap.findMany({
      where: { trackId },
      select: {
        id: true,
        version: true,
        title: true,
        isCurrent: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private formatRoadmapDAG(roadmap: any, userId?: string) {
    const topicMap = new Map<string, any>();
    const edges: Array<{ from: string; to: string }> = [];

    roadmap.topics.forEach((t: any) => {
      const userStatus = userId && t.progress?.[0] ? t.progress[0].status : 'NOT_STARTED';
      const completedAt = userId && t.progress?.[0] ? t.progress[0].completedAt : null;

      const prerequisiteIds = t.prerequisites.map((p: any) => p.prerequisiteId);
      const dependentIds = t.prerequisiteFor.map((p: any) => p.topicId);

      prerequisiteIds.forEach((prereqId: string) => {
        edges.push({ from: prereqId, to: t.id });
      });

      topicMap.set(t.id, {
        id: t.id,
        title: t.title,
        description: t.description,
        level: t.level,
        order: t.order,
        estimatedHours: t.estimatedHours,
        milestoneId: t.milestoneId,
        milestoneTitle: t.milestone?.title || null,
        resources: t.resources,
        prerequisiteTopicIds: prerequisiteIds,
        dependentTopicIds: dependentIds,
        userProgress: {
          status: userStatus,
          completedAt,
        },
      });
    });

    // Compute topological depth / levels for DAG visual layers
    const inDegrees = new Map<string, number>();
    topicMap.forEach((node, id) => {
      inDegrees.set(id, node.prerequisiteTopicIds.length);
    });

    const depths = new Map<string, number>();
    const queue: string[] = [];

    inDegrees.forEach((deg, id) => {
      if (deg === 0) {
        queue.push(id);
        depths.set(id, 0);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentDepth = depths.get(current) || 0;
      const node = topicMap.get(current);

      if (node) {
        node.dependentTopicIds.forEach((nextId: string) => {
          const newDepth = Math.max(depths.get(nextId) || 0, currentDepth + 1);
          depths.set(nextId, newDepth);
          const nextDeg = (inDegrees.get(nextId) || 1) - 1;
          inDegrees.set(nextId, nextDeg);
          if (nextDeg === 0) {
            queue.push(nextId);
          }
        });
      }
    }

    const nodes = Array.from(topicMap.values()).map((node) => ({
      ...node,
      dagLayer: depths.get(node.id) ?? 0,
    }));

    const totalEstimatedHours = nodes.reduce((sum, n) => sum + (n.estimatedHours || 0), 0);

    return {
      id: roadmap.id,
      trackId: roadmap.trackId,
      trackName: roadmap.track?.name,
      trackTitle: roadmap.track?.title,
      title: roadmap.title,
      description: roadmap.description,
      version: roadmap.version,
      isCurrent: roadmap.isCurrent,
      totalTopics: nodes.length,
      totalEstimatedHours,
      milestones: roadmap.milestones.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        order: m.order,
        topicIds: nodes.filter((n) => n.milestoneId === m.id).map((n) => n.id),
      })),
      graph: {
        nodes,
        edges,
      },
    };
  }
}
