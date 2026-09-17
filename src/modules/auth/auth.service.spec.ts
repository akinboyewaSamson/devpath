import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: any;
  let jwtService: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      if (key === 'JWT_ACCESS_SECRET') return 'test_access_secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
      if (key === 'JWT_ACCESS_EXPIRATION') return '15m';
      if (key === 'JWT_REFRESH_EXPIRATION') return '7d';
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user successfully and return tokens', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@devpath.io',
        name: 'Test User',
        role: 'USER',
        currentTrackId: null,
        streakDays: 0,
        createdAt: new Date(),
      });
      mockPrismaService.refreshToken.create.mockResolvedValue({ id: 'token-1' });

      const result = await authService.register({
        email: 'test@devpath.io',
        password: 'Password123!',
        name: 'Test User',
      });

      expect(result.user.email).toBe('test@devpath.io');
      expect(result.tokens.accessToken).toBe('mocked.jwt.token');
      expect(result.tokens.refreshToken).toBe('mocked.jwt.token');
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.register({
          email: 'existing@devpath.io',
          password: 'Password123!',
          name: 'Existing',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user and return tokens when credentials match', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword!', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@devpath.io',
        passwordHash,
        name: 'User One',
        role: 'USER',
        currentTrackId: null,
        streakDays: 2,
        createdAt: new Date(),
      });
      mockPrismaService.refreshToken.create.mockResolvedValue({ id: 'tok-1' });

      const result = await authService.login({
        email: 'user@devpath.io',
        password: 'CorrectPassword!',
      });

      expect(result.user.id).toBe('user-1');
      expect(result.tokens.accessToken).toBe('mocked.jwt.token');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword!', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@devpath.io',
        passwordHash,
      });

      await expect(
        authService.login({
          email: 'user@devpath.io',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'notfound@devpath.io',
          password: 'Password!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should remove refresh tokens for user', async () => {
      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      const result = await authService.logout('user-1');
      expect(result.message).toBe('Logged out successfully');
      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });
});
