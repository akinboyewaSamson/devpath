# DevPath Backend API

A production-grade RESTful backend for **DevPath**, a platform that generates structured, step-by-step learning roadmaps for software engineers. Users select a track (Frontend or Backend) and progress through curated topics from beginner to expert, tracking their completion with server-side prerequisite validation and gamification streaks.

---

## 🛠 Tech Stack

- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT access & refresh token rotation, Passport.js, `bcrypt`
- **Validation**: `class-validator` + `class-transformer` with a global `ValidationPipe`
- **Rate Limiting**: `@nestjs/throttler` (protecting authentication endpoints against brute-force)
- **API Documentation**: [Swagger UI](https://swagger.io/) at `/api/docs`
- **Testing**: Jest (Unit testing & Supertest E2E integration testing)

---

## 🌟 Key Architecture & Features

1. **DAG Topic Prerequisite Topology**:
   - Topics are structured as a Directed Acyclic Graph (DAG) instead of a flat linear list.
   - Allows learning pathways to branch (e.g. into Relational PostgreSQL and NoSQL MongoDB) and converge (e.g. into REST APIs & Authentication).
   - Topic response returns DAG nodes, directed edges, and calculated topological level depths.
   - Admin prerequisite creation validates against cyclical dependencies (cycle detection).
2. **Server-Side Prerequisite Enforcement**:
   - Marking a topic as `COMPLETED` verifies that all prerequisite topics have already been completed by the user.
   - Returns a detailed `400 Bad Request` listing incomplete prerequisites if blocked.
3. **Gamification Layer**:
   - Tracks consecutive day streaks (`streakDays`) and `lastActiveDate`.
   - Automatically maintains, increments, or resets streaks based on user activity.
4. **Roadmap Versioning**:
   - Roadmaps are explicitly versioned (`1.0.0`, `1.1.0`, etc.) ensuring ongoing user progress is not silently mutated when course content evolves.
5. **Role-Based Access Control**:
   - Standard user endpoints and Admin content management (`Role.ADMIN`) with guards.
6. **Consistent Error Envelope**:
   - Global `HttpExceptionFilter` ensuring uniform `{ statusCode, message, error, timestamp, path }` error responses.

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (v14+) running locally or via Docker

### 2. Environment Configuration
Copy the example environment file and update credentials if needed:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://devpath_user@localhost:5433/devpath?schema=public"
JWT_ACCESS_SECRET="devpath_super_secret_access_key_change_in_production_2026"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_SECRET="devpath_super_secret_refresh_key_change_in_production_2026"
JWT_REFRESH_EXPIRATION="7d"
THROTTLE_TTL=60000
THROTTLE_LIMIT=30
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migration & Seed
Run Prisma database migrations to create tables, relations, and indexes:
```bash
npx prisma migrate dev --name init
```

Generate the Prisma client:
```bash
npx prisma generate
```

Seed initial tracks, the Backend Developer DAG roadmap, curated resources, and initial admin/learner accounts:
```bash
npm run prisma:seed
```

**Default Seed Accounts:**
- **Admin**: `admin@devpath.io` / `AdminPass123!`
- **Learner**: `learner@devpath.io` / `UserPass123!`

---

## 🏃‍♂️ Running the Application

### Development Server
```bash
npm run start:dev
```
The server will start at `http://localhost:3000/api`.

### Interactive Swagger API Documentation
Once running, open your browser to:
```
http://localhost:3000/api/docs
```

---

## 🧪 Testing

### Unit Tests
Tests service business logic, including prerequisite enforcement and streak calculation:
```bash
npm run test
```

### End-to-End (E2E) Tests
Tests complete API flows (registration, login, token refresh, track selection, roadmap DAG retrieval, and progress tracking):
```bash
npm run test:e2e
```

### Production Build Check
```bash
npm run build
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| **POST** | `/api/auth/register` | Register new account & return token pair | No (Throttled) |
| **POST** | `/api/auth/login` | Authenticate with email/password | No (Throttled) |
| **POST** | `/api/auth/refresh` | Issue new access & refresh token pair | No (Throttled) |
| **POST** | `/api/auth/logout` | Revoke active refresh token | Bearer JWT |
| **GET** | `/api/users/profile` | Current user profile & streak data | Bearer JWT |
| **PATCH**| `/api/users/profile` | Update profile (name, avatar) | Bearer JWT |
| **POST** | `/api/users/change-password` | Update account password | Bearer JWT |
| **GET** | `/api/tracks` | List all available tracks | No |
| **GET** | `/api/tracks/:id` | Get track details | No |
| **POST** | `/api/tracks/select` | Set or switch user active track | Bearer JWT |
| **GET** | `/api/roadmaps/:id` | Retrieve roadmap DAG graph with nodes & edges | No |
| **GET** | `/api/roadmaps/track/:trackId` | Retrieve latest active roadmap DAG for a track | No |
| **GET** | `/api/roadmaps/track/:trackId/versions` | List version history for a track | No |
| **POST** | `/api/progress/:topicId` | Update topic status (validates DAG prerequisites) | Bearer JWT |
| **GET** | `/api/progress/summary` | Progress percentage breakdown by roadmap & level | Bearer JWT |
| **GET** | `/api/progress/recent` | List recently completed topics | Bearer JWT |
| **GET** | `/api/dashboard` | Aggregated user dashboard view | Bearer JWT |
| **CRUD** | `/api/admin/*` | Content management (tracks, roadmaps, topics, DAG edges, resources) | Bearer JWT (Admin) |

---

## 🛡 Security & Best Practices
- Passwords salted and hashed with `bcrypt` (never logged or stored in plain text).
- Refresh tokens hashed in the database and rotated on each refresh.
- Rate-limited auth endpoints via `@nestjs/throttler`.
- Whitelisted input validation via `class-validator` stripping unwanted properties.
- Strongly typed relations with foreign key constraints, cascade deletes, and DAG cycle prevention.
