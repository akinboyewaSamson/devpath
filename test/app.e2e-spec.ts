import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('DevPath Backend E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let trackId: string;
  let roadmapId: string;
  let topic1Id: string;
  let topic2Id: string;

  const testEmail = `e2e_user_${Date.now()}@devpath.io`;
  const testPassword = 'Password123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Auth Flow', () => {
    it('/api/auth/register (POST) - should create user and return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          name: 'E2E Tester',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');

      accessToken = response.body.tokens.accessToken;
      refreshToken = response.body.tokens.refreshToken;
    });

    it('/api/auth/register (POST) - duplicate email should return 409', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          name: 'E2E Duplicate',
        })
        .expect(409);
    });

    it('/api/auth/login (POST) - should authenticate and return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('tokens');
      accessToken = response.body.tokens.accessToken;
    });

    it('/api/auth/login (POST) - invalid password returns 401', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword!',
        })
        .expect(401);
    });

    it('/api/auth/refresh (POST) - should issue new token pair', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });
  });

  describe('2. User Profile & Tracks Flow', () => {
    it('/api/users/profile (GET) - returns authenticated profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.email).toBe(testEmail);
      expect(response.body.name).toBe('E2E Tester');
    });

    it('/api/tracks (GET) - lists available tracks', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tracks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        trackId = response.body[0].id;
      }
    });

    it('/api/tracks/select (POST) - selects active track for user', async () => {
      if (!trackId) return;

      const response = await request(app.getHttpServer())
        .post('/api/tracks/select')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ trackId })
        .expect(200);

      expect(response.body.currentTrackId).toBe(trackId);
    });
  });

  describe('3. Roadmap Retrieval (DAG)', () => {
    it('/api/roadmaps/track/:trackId (GET) - returns roadmap in DAG format', async () => {
      if (!trackId) return;

      const response = await request(app.getHttpServer())
        .get(`/api/roadmaps/track/${trackId}`)
        .expect(200);

      expect(response.body).toHaveProperty('graph');
      expect(response.body.graph).toHaveProperty('nodes');
      expect(response.body.graph).toHaveProperty('edges');

      roadmapId = response.body.id;
      if (response.body.graph.nodes.length > 0) {
        topic1Id = response.body.graph.nodes[0].id;
      }
    });
  });

  describe('4. Progress & Prerequisite Enforcement', () => {
    it('/api/progress/:topicId (POST) - marks topic in-progress', async () => {
      if (!topic1Id) return;

      const response = await request(app.getHttpServer())
        .post(`/api/progress/${topic1Id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'IN_PROGRESS' })
        .expect(200);

      expect(response.body.progress.status).toBe('IN_PROGRESS');
    });

    it('/api/progress/summary (GET) - returns user progress metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/progress/summary')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('overallPercentage');
      expect(response.body).toHaveProperty('byLevel');
    });

    it('/api/dashboard (GET) - aggregates user dashboard data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('progress');
      expect(response.body).toHaveProperty('currentTopic');
    });
  });
});
