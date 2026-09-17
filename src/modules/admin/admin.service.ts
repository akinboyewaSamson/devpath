import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTrackDto,
  CreateRoadmapDto,
  CreateMilestoneDto,
  CreateTopicDto,
  UpdateTopicDto,
  CreateResourceDto,
  AddPrerequisiteDto,
} from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Tracks CRUD
  async createTrack(dto: CreateTrackDto) {
    const existing = await this.prisma.track.findUnique({
      where: { name: dto.name.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException(`Track with name "${dto.name}" already exists`);
    }

    return this.prisma.track.create({
      data: {
        name: dto.name.toLowerCase(),
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async updateTrack(id: string, dto: Partial<CreateTrackDto>) {
    await this.ensureTrackExists(id);
    return this.prisma.track.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name.toLowerCase() }),
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
      },
    });
  }

  async deleteTrack(id: string) {
    await this.ensureTrackExists(id);
    return this.prisma.track.delete({ where: { id } });
  }

  // Roadmaps CRUD
  async createRoadmap(dto: CreateRoadmapDto) {
    await this.ensureTrackExists(dto.trackId);

    const existing = await this.prisma.roadmap.findUnique({
      where: {
        trackId_version: {
          trackId: dto.trackId,
          version: dto.version,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Roadmap version "${dto.version}" already exists for this track`,
      );
    }

    return this.prisma.roadmap.create({
      data: {
        trackId: dto.trackId,
        title: dto.title,
        description: dto.description,
        version: dto.version,
        isCurrent: true,
      },
    });
  }

  async setRoadmapCurrent(id: string) {
    const roadmap = await this.prisma.roadmap.findUnique({ where: { id } });
    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID "${id}" not found`);
    }

    // Set other roadmaps for this track to isCurrent = false
    await this.prisma.roadmap.updateMany({
      where: { trackId: roadmap.trackId },
      data: { isCurrent: false },
    });

    return this.prisma.roadmap.update({
      where: { id },
      data: { isCurrent: true },
    });
  }

  async deleteRoadmap(id: string) {
    const roadmap = await this.prisma.roadmap.findUnique({ where: { id } });
    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID "${id}" not found`);
    }
    return this.prisma.roadmap.delete({ where: { id } });
  }

  // Milestones CRUD
  async createMilestone(dto: CreateMilestoneDto) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id: dto.roadmapId },
    });
    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID "${dto.roadmapId}" not found`);
    }

    return this.prisma.milestone.create({
      data: {
        roadmapId: dto.roadmapId,
        title: dto.title,
        description: dto.description,
        order: dto.order,
      },
    });
  }

  async deleteMilestone(id: string) {
    return this.prisma.milestone.delete({ where: { id } });
  }

  // Topics CRUD
  async createTopic(dto: CreateTopicDto) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id: dto.roadmapId },
    });
    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID "${dto.roadmapId}" not found`);
    }

    return this.prisma.topic.create({
      data: {
        roadmapId: dto.roadmapId,
        milestoneId: dto.milestoneId || null,
        title: dto.title,
        description: dto.description,
        level: dto.level,
        order: dto.order,
        estimatedHours: dto.estimatedHours || 1.0,
      },
      include: {
        milestone: true,
      },
    });
  }

  async updateTopic(id: string, dto: UpdateTopicDto) {
    await this.ensureTopicExists(id);
    return this.prisma.topic.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.level && { level: dto.level }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.estimatedHours !== undefined && { estimatedHours: dto.estimatedHours }),
        ...(dto.milestoneId !== undefined && { milestoneId: dto.milestoneId }),
      },
    });
  }

  async deleteTopic(id: string) {
    await this.ensureTopicExists(id);
    return this.prisma.topic.delete({ where: { id } });
  }

  // Prerequisites DAG management with cycle prevention
  async addPrerequisite(dto: AddPrerequisiteDto) {
    if (dto.topicId === dto.prerequisiteId) {
      throw new BadRequestException('A topic cannot have itself as a prerequisite');
    }

    const [topic, prereq] = await Promise.all([
      this.prisma.topic.findUnique({ where: { id: dto.topicId } }),
      this.prisma.topic.findUnique({ where: { id: dto.prerequisiteId } }),
    ]);

    if (!topic || !prereq) {
      throw new NotFoundException('Topic or prerequisite topic not found');
    }

    if (topic.roadmapId !== prereq.roadmapId) {
      throw new BadRequestException('Prerequisites must belong to the same roadmap');
    }

    // Cycle detection: Does adding this edge create a cycle?
    // Check if topicId is an ancestor of prerequisiteId
    const wouldCreateCycle = await this.hasPath(dto.topicId, dto.prerequisiteId);
    if (wouldCreateCycle) {
      throw new BadRequestException(
        `Cannot add prerequisite: creating this link would introduce a circular dependency (cycle) in the roadmap DAG.`,
      );
    }

    const existing = await this.prisma.topicPrerequisite.findUnique({
      where: {
        topicId_prerequisiteId: {
          topicId: dto.topicId,
          prerequisiteId: dto.prerequisiteId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.topicPrerequisite.create({
      data: {
        topicId: dto.topicId,
        prerequisiteId: dto.prerequisiteId,
      },
    });
  }

  async removePrerequisite(topicId: string, prerequisiteId: string) {
    return this.prisma.topicPrerequisite.delete({
      where: {
        topicId_prerequisiteId: {
          topicId,
          prerequisiteId,
        },
      },
    });
  }

  // Resources CRUD
  async createResource(dto: CreateResourceDto) {
    await this.ensureTopicExists(dto.topicId);
    return this.prisma.resource.create({
      data: {
        topicId: dto.topicId,
        type: dto.type,
        url: dto.url,
        title: dto.title,
      },
    });
  }

  async deleteResource(id: string) {
    return this.prisma.resource.delete({ where: { id } });
  }

  // Cycle detection DFS helper
  private async hasPath(fromId: string, targetId: string): Promise<boolean> {
    const visited = new Set<string>();
    const queue = [fromId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetId) return true;
      if (!visited.has(current)) {
        visited.add(current);
        const children = await this.prisma.topicPrerequisite.findMany({
          where: { prerequisiteId: current },
          select: { topicId: true },
        });
        for (const child of children) {
          if (!visited.has(child.topicId)) {
            queue.push(child.topicId);
          }
        }
      }
    }
    return false;
  }

  private async ensureTrackExists(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }
    return track;
  }

  private async ensureTopicExists(id: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) {
      throw new NotFoundException(`Topic with ID "${id}" not found`);
    }
    return topic;
  }
}
