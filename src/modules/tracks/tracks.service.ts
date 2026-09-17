import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SelectTrackDto } from './dto/select-track.dto';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const tracks = await this.prisma.track.findMany({
      include: {
        _count: {
          select: {
            roadmaps: true,
            users: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tracks;
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        roadmaps: {
          where: { isCurrent: true },
          select: {
            id: true,
            title: true,
            version: true,
            description: true,
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with ID "${id}" not found`);
    }

    return track;
  }

  async selectTrack(userId: string, dto: SelectTrackDto) {
    const track = await this.prisma.track.findUnique({
      where: { id: dto.trackId },
    });

    if (!track) {
      throw new NotFoundException(`Track with ID "${dto.trackId}" not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { currentTrackId: dto.trackId },
      select: {
        id: true,
        email: true,
        name: true,
        currentTrackId: true,
        currentTrack: {
          select: {
            id: true,
            name: true,
            title: true,
          },
        },
      },
    });

    return updatedUser;
  }
}
