import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        currentTrackId: true,
        streakDays: true,
        lastActiveDate: true,
        createdAt: true,
        currentTrack: {
          select: {
            id: true,
            name: true,
            title: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        currentTrackId: true,
        streakDays: true,
        lastActiveDate: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate refresh tokens after password change
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Password changed successfully' };
  }

  async recordActivity(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true, lastActiveDate: true },
    });

    if (!user) return 0;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!user.lastActiveDate) {
      // First activity
      await this.prisma.user.update({
        where: { id: userId },
        data: { streakDays: 1, lastActiveDate: now },
      });
      return 1;
    }

    const last = new Date(user.lastActiveDate);
    const lastDate = new Date(last.getFullYear(), last.getMonth(), last.getDate());

    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) {
      // Same day, update timestamp only
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastActiveDate: now },
      });
      return user.streakDays;
    } else if (diffDays === 1) {
      // Consecutive day streak increment
      const newStreak = user.streakDays + 1;
      await this.prisma.user.update({
        where: { id: userId },
        data: { streakDays: newStreak, lastActiveDate: now },
      });
      return newStreak;
    } else {
      // Streak broken, reset to 1
      await this.prisma.user.update({
        where: { id: userId },
        data: { streakDays: 1, lastActiveDate: now },
      });
      return 1;
    }
  }
}
