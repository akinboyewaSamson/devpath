import { PrismaClient, Role, TopicLevel, ResourceType, ProgressStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DevPath database with Java Backend & Modern Frontend curricula...');

  // 1. Clean existing seed records
  await prisma.userProgress.deleteMany();
  await prisma.topicPrerequisite.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.track.deleteMany();

  // 2. Create Users
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', salt);
  const userPasswordHash = await bcrypt.hash('UserPass123!', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@devpath.io',
      name: 'DevPath Admin',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      streakDays: 14,
      lastActiveDate: new Date(),
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'learner@devpath.io',
      name: 'Alex Johnson',
      passwordHash: userPasswordHash,
      role: Role.USER,
      streakDays: 5,
      lastActiveDate: new Date(),
    },
  });

  console.log(`Created users: Admin (${admin.email}), User (${testUser.email})`);

  // 3. Create Tracks
  const backendTrack = await prisma.track.create({
    data: {
      name: 'backend',
      title: 'Java Backend Engineering',
      description:
        'Master enterprise Java 21, JVM architecture, Spring Boot, PostgreSQL persistence, Spring Security, microservices, and cloud-native systems.',
    },
  });

  const frontendTrack = await prisma.track.create({
    data: {
      name: 'frontend',
      title: 'Frontend Engineering (HTML, CSS, Tailwind, React)',
      description:
        'Master modern web fundamentals, semantic HTML5, responsive CSS, Tailwind CSS design systems, modern ES6+ JavaScript, React component patterns, and Next.js 14.',
    },
  });

  await prisma.user.update({
    where: { id: testUser.id },
    data: { currentTrackId: backendTrack.id },
  });

  // ==========================================
  // 4. BACKEND: JAVA ROADMAP 2026
  // ==========================================
  const javaRoadmap = await prisma.roadmap.create({
    data: {
      trackId: backendTrack.id,
      title: 'Java Backend Developer Roadmap 2026',
      description:
        'An enterprise learning journey covering modern Java 21, OOP, Collections, JVM memory & concurrency, Maven/Gradle, Spring Boot, Spring Data JPA with PostgreSQL, and Spring Security.',
      version: '1.0.0',
      isCurrent: true,
    },
  });

  // Java Milestones
  const jm1 = await prisma.milestone.create({
    data: {
      roadmapId: javaRoadmap.id,
      title: '1. Java Core & OOP Foundations',
      description: 'Master Java 21 syntax, strong typing, and core object-oriented principles.',
      order: 1,
    },
  });

  const jm2 = await prisma.milestone.create({
    data: {
      roadmapId: javaRoadmap.id,
      title: '2. Collections & Modern Functional Java',
      description: 'Work fluently with List, Set, Map collections and declarative Streams API.',
      order: 2,
    },
  });

  const jm3 = await prisma.milestone.create({
    data: {
      roadmapId: javaRoadmap.id,
      title: '3. JVM Internals & Multithreading',
      description: 'Understand the JVM memory model, garbage collection, and modern Virtual Threads.',
      order: 3,
    },
  });

  const jm4 = await prisma.milestone.create({
    data: {
      roadmapId: javaRoadmap.id,
      title: '4. Build Tools & Testing Automation',
      description: 'Automate dependency builds with Maven/Gradle and write robust JUnit 5 tests.',
      order: 4,
    },
  });

  const jm5 = await prisma.milestone.create({
    data: {
      roadmapId: javaRoadmap.id,
      title: '5. Spring Boot & REST APIs',
      description: 'Build enterprise-ready web services using Spring Boot 3 and Spring MVC.',
      order: 5,
    },
  });

  const jm6 = await prisma.milestone.create({
    data: {
      roadmapId: javaRoadmap.id,
      title: '6. PostgreSQL Persistence & Spring Data JPA',
      description: 'Model relational schemas, write repository queries, and manage schema migrations.',
      order: 6,
    },
  });

  const jm7 = await prisma.milestone.create({
    data: {
      roadmapId: javaRoadmap.id,
      title: '7. Enterprise Security & Microservices',
      description: 'Secure endpoints with Spring Security JWT and architect resilient distributed systems.',
      order: 7,
    },
  });

  // Java Topics
  const jt1 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm1.id,
      title: 'Java 21 Syntax & OOP Core',
      description: 'Classes, interfaces, records, pattern matching, encapsulation, polymorphism, and exception handling.',
      level: TopicLevel.BEGINNER,
      order: 1,
      estimatedHours: 8.0,
    },
  });

  const jt2 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm2.id,
      title: 'Collections Framework & Generics',
      description: 'Mastering ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap, and type-safe Generics.',
      level: TopicLevel.BEGINNER,
      order: 2,
      estimatedHours: 8.0,
    },
  });

  const jt3 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm2.id,
      title: 'Java Streams API & Lambdas',
      description: 'Functional programming in Java: filter, map, flatMap, reduce, collectors, and Optional patterns.',
      level: TopicLevel.INTERMEDIATE,
      order: 3,
      estimatedHours: 7.0,
    },
  });

  const jt4 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm3.id,
      title: 'JVM Memory Architecture & GC',
      description: 'Stack vs Heap memory, Metaspace, ClassLoading, and Garbage Collection tuning (G1, ZGC).',
      level: TopicLevel.ADVANCED,
      order: 4,
      estimatedHours: 8.0,
    },
  });

  const jt5 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm3.id,
      title: 'Concurrency & Virtual Threads',
      description: 'Thread safety, synchronization, ExecutorService, CompletableFuture, and Java 21 Virtual Threads (Project Loom).',
      level: TopicLevel.ADVANCED,
      order: 5,
      estimatedHours: 10.0,
    },
  });

  const jt6 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm4.id,
      title: 'Maven & Gradle Build Automation',
      description: 'Dependency scopes, plugins, multi-module project management, and reproducible JVM builds.',
      level: TopicLevel.BEGINNER,
      order: 6,
      estimatedHours: 5.0,
    },
  });

  const jt7 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm4.id,
      title: 'Unit Testing with JUnit 5 & Mockito',
      description: 'Parameterized tests, assertions with AssertJ, mocking dependencies with Mockito, and test-driven workflows.',
      level: TopicLevel.INTERMEDIATE,
      order: 7,
      estimatedHours: 7.0,
    },
  });

  const jt8 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm5.id,
      title: 'Spring Boot 3 Core & IoC',
      description: 'ApplicationContext, Bean lifecycle, Dependency Injection (@Component, @Service, @Autowired), and configuration properties.',
      level: TopicLevel.INTERMEDIATE,
      order: 8,
      estimatedHours: 9.0,
    },
  });

  const jt9 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm5.id,
      title: 'RESTful Web Services with Spring MVC',
      description: 'Designing controllers, RequestBody/ResponseBody, DTO mapping, Jakarta Validation, and global exception handlers (@ControllerAdvice).',
      level: TopicLevel.INTERMEDIATE,
      order: 9,
      estimatedHours: 10.0,
    },
  });

  const jt10 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm6.id,
      title: 'Relational DBs & PostgreSQL for Java',
      description: 'Relational database fundamentals, ACID properties, foreign keys, indexes, and connection pooling with HikariCP.',
      level: TopicLevel.BEGINNER,
      order: 10,
      estimatedHours: 6.0,
    },
  });

  const jt11 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm6.id,
      title: 'Spring Data JPA, Hibernate & Flyway',
      description: 'Entity mapping (@Entity, @Table), repository methods, JPQL queries, pagination, and automated database migrations with Flyway.',
      level: TopicLevel.INTERMEDIATE,
      order: 11,
      estimatedHours: 12.0,
    },
  });

  const jt12 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm7.id,
      title: 'Spring Security & JWT Authentication',
      description: 'SecurityFilterChain, UserDetailsService, BCrypt password hashing, stateless JWT token filters, and role-based access control (@PreAuthorize).',
      level: TopicLevel.ADVANCED,
      order: 12,
      estimatedHours: 11.0,
    },
  });

  const jt13 = await prisma.topic.create({
    data: {
      roadmapId: javaRoadmap.id,
      milestoneId: jm7.id,
      title: 'Microservices & Event-Driven Systems',
      description: 'Inter-service communication with OpenFeign, API gateways, resilience with Resilience4j, and message streaming with Apache Kafka.',
      level: TopicLevel.EXPERT,
      order: 13,
      estimatedHours: 14.0,
    },
  });

  // Java Prerequisites (DAG)
  await prisma.topicPrerequisite.createMany({
    data: [
      { topicId: jt2.id, prerequisiteId: jt1.id }, // Collections requires Syntax & OOP
      { topicId: jt3.id, prerequisiteId: jt2.id }, // Streams requires Collections
      { topicId: jt4.id, prerequisiteId: jt1.id }, // JVM requires Syntax
      { topicId: jt5.id, prerequisiteId: jt4.id }, // Concurrency requires JVM
      { topicId: jt6.id, prerequisiteId: jt1.id }, // Maven requires Syntax
      { topicId: jt7.id, prerequisiteId: jt6.id }, // Testing requires Maven
      { topicId: jt8.id, prerequisiteId: jt7.id }, // Spring Core requires Testing
      { topicId: jt9.id, prerequisiteId: jt8.id }, // Spring MVC requires Spring Core
      { topicId: jt11.id, prerequisiteId: jt10.id }, // JPA requires PostgreSQL
      { topicId: jt11.id, prerequisiteId: jt9.id },  // JPA requires Spring MVC
      { topicId: jt12.id, prerequisiteId: jt11.id }, // Security requires JPA
      { topicId: jt13.id, prerequisiteId: jt12.id }, // Microservices requires Security
    ],
  });

  // Java Resources
  await prisma.resource.createMany({
    data: [
      {
        topicId: jt1.id,
        title: 'Oracle Java 21 Official Tutorial',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/index.html',
        type: ResourceType.DOCS,
      },
      {
        topicId: jt1.id,
        title: 'University of Helsinki Java Programming I',
        url: 'https://java-programming.mooc.fi/',
        type: ResourceType.COURSE,
      },
      {
        topicId: jt2.id,
        title: 'Baeldung: Guide to Java Collections Framework',
        url: 'https://www.baeldung.com/category/java/java-collections',
        type: ResourceType.ARTICLE,
      },
      {
        topicId: jt3.id,
        title: 'Baeldung: Modern Java Streams Tutorial',
        url: 'https://www.baeldung.com/java-8-streams',
        type: ResourceType.ARTICLE,
      },
      {
        topicId: jt4.id,
        title: 'Java Brains: Understanding the JVM Architecture',
        url: 'https://www.youtube.com/c/JavaBrainsChannel',
        type: ResourceType.VIDEO,
      },
      {
        topicId: jt5.id,
        title: 'Baeldung: Guide to Virtual Threads in Java 21',
        url: 'https://www.baeldung.com/java-virtual-threads',
        type: ResourceType.ARTICLE,
      },
      {
        topicId: jt8.id,
        title: 'Spring.io: Building an Application with Spring Boot',
        url: 'https://spring.io/guides/gs/spring-boot',
        type: ResourceType.DOCS,
      },
      {
        topicId: jt9.id,
        title: 'Spring.io: Building a RESTful Web Service',
        url: 'https://spring.io/guides/gs/rest-service',
        type: ResourceType.DOCS,
      },
      {
        topicId: jt11.id,
        title: 'Baeldung: Spring Data JPA Complete Guide',
        url: 'https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa',
        type: ResourceType.ARTICLE,
      },
      {
        topicId: jt12.id,
        title: 'Baeldung: Spring Security with JWT',
        url: 'https://www.baeldung.com/spring-security-oauth-jwt',
        type: ResourceType.ARTICLE,
      },
    ],
  });

  // ==========================================
  // 5. FRONTEND: MODERN WEB & REACT ROADMAP 2026
  // ==========================================
  const frontendRoadmap = await prisma.roadmap.create({
    data: {
      trackId: frontendTrack.id,
      title: 'Modern Frontend Engineering Roadmap 2026',
      description:
        'A comprehensive web development roadmap covering HTML5 semantics, modern CSS & responsive design, Tailwind CSS styling systems, modern ES6+ JavaScript, React component patterns, and Next.js 14.',
      version: '1.0.0',
      isCurrent: true,
    },
  });

  // Frontend Milestones
  const fm1 = await prisma.milestone.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: '1. Semantic HTML & Accessible Web',
      description: 'Lay solid structural foundations with accessible, semantic HTML5 markup.',
      order: 1,
    },
  });

  const fm2 = await prisma.milestone.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: '2. Modern CSS & Responsive Layouts',
      description: 'Master the box model, Flexbox, and CSS Grid for dynamic layouts.',
      order: 2,
    },
  });

  const fm3 = await prisma.milestone.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: '3. Tailwind CSS & Design Systems',
      description: 'Build polished, responsive user interfaces rapidly with utility-first CSS.',
      order: 3,
    },
  });

  const fm4 = await prisma.milestone.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: '4. Modern JavaScript Core (ES6+)',
      description: 'Master scopes, asynchronous programming, promises, and the browser DOM.',
      order: 4,
    },
  });

  const fm5 = await prisma.milestone.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: '5. React Fundamentals & State',
      description: 'Declarative UI architecture with components, JSX, props, and useState.',
      order: 5,
    },
  });

  const fm6 = await prisma.milestone.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: '6. Advanced React Hooks & Architecture',
      description: 'Lifecycle synchronization with useEffect, performance hooks, and custom hooks.',
      order: 6,
    },
  });

  const fm7 = await prisma.milestone.create({
    data: {
      roadmapId: frontendRoadmap.id,
      title: '7. Data Fetching & Next.js 14 App Router',
      description: 'Server state with TanStack Query, Next.js Server Components, and full-stack web apps.',
      order: 7,
    },
  });

  // Frontend Topics
  const ft1 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm1.id,
      title: 'Semantic HTML5 & Web Structure',
      description: 'Document outline, sectioning elements (<header>, <nav>, <main>, <article>), semantic forms, and meta tags.',
      level: TopicLevel.BEGINNER,
      order: 1,
      estimatedHours: 5.0,
    },
  });

  const ft2 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm1.id,
      title: 'Web Accessibility (a11y) & SEO',
      description: 'WCAG compliance, ARIA attributes, keyboard navigation, screen reader testing, and Open Graph SEO tags.',
      level: TopicLevel.BEGINNER,
      order: 2,
      estimatedHours: 5.0,
    },
  });

  const ft3 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm2.id,
      title: 'CSS Box Model & Flexbox Mastery',
      description: 'Margin, border, padding, flex container properties, justify/align axes, and flexible responsive wrapping.',
      level: TopicLevel.BEGINNER,
      order: 3,
      estimatedHours: 7.0,
    },
  });

  const ft4 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm2.id,
      title: 'CSS Grid & Responsive Media Queries',
      description: 'Two-dimensional grid layouts, grid-template-areas, auto-fit/auto-fill, minmax(), and responsive breakpoints.',
      level: TopicLevel.INTERMEDIATE,
      order: 4,
      estimatedHours: 6.0,
    },
  });

  const ft5 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm3.id,
      title: 'Tailwind CSS Utility-First Styling',
      description: 'Core utility classes, spacing scales, typography plugin, color tokens, and hover/focus/active state modifiers.',
      level: TopicLevel.BEGINNER,
      order: 5,
      estimatedHours: 6.0,
    },
  });

  const ft6 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm3.id,
      title: 'Customizing Tailwind & Component Patterns',
      description: 'Configuring theme tokens, arbitrary values, creating reusable design components, and integrating with Tailwind Merge/clsx.',
      level: TopicLevel.INTERMEDIATE,
      order: 6,
      estimatedHours: 7.0,
    },
  });

  const ft7 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm4.id,
      title: 'Modern JavaScript (ES6+) Fundamentals',
      description: 'Arrow functions, destructuring, rest/spread operators, array methods (map, filter, reduce), closures, and modules.',
      level: TopicLevel.BEGINNER,
      order: 7,
      estimatedHours: 9.0,
    },
  });

  const ft8 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm4.id,
      title: 'Async JavaScript: Promises & Fetch API',
      description: 'Event loop, microtask queue, Promise chaining, async/await syntax, HTTP error handling, and JSON parsing.',
      level: TopicLevel.INTERMEDIATE,
      order: 8,
      estimatedHours: 8.0,
    },
  });

  const ft9 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm5.id,
      title: 'React Fundamentals: Components & Props',
      description: 'Declarative component trees, JSX syntax rules, passing typed props, conditional rendering, and rendering dynamic lists.',
      level: TopicLevel.BEGINNER,
      order: 9,
      estimatedHours: 9.0,
    },
  });

  const ft10 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm5.id,
      title: 'Interactive State with useState & Events',
      description: 'React state mechanics, unidirectional data flow, immutability, controlled inputs, and form submissions.',
      level: TopicLevel.INTERMEDIATE,
      order: 10,
      estimatedHours: 8.0,
    },
  });

  const ft11 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm6.id,
      title: 'React Hooks & Lifecycle Synchronization',
      description: 'Side effects with useEffect, cleanup functions, useRef for DOM access, useMemo/useCallback performance optimization, and custom hooks.',
      level: TopicLevel.INTERMEDIATE,
      order: 11,
      estimatedHours: 10.0,
    },
  });

  const ft12 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm7.id,
      title: 'Server State with TanStack Query',
      description: 'Automatic caching, background data revalidation, query invalidation, mutation handling, and optimistic UI updates.',
      level: TopicLevel.ADVANCED,
      order: 12,
      estimatedHours: 8.0,
    },
  });

  const ft13 = await prisma.topic.create({
    data: {
      roadmapId: frontendRoadmap.id,
      milestoneId: fm7.id,
      title: 'Next.js 14 App Router & Server Components',
      description: 'React Server Components (RSC) vs Client Components, nested layouts, loading/error boundaries, routing, and deployment optimization.',
      level: TopicLevel.ADVANCED,
      order: 13,
      estimatedHours: 12.0,
    },
  });

  // Frontend Prerequisites (DAG)
  await prisma.topicPrerequisite.createMany({
    data: [
      { topicId: ft2.id, prerequisiteId: ft1.id }, // a11y requires Semantic HTML
      { topicId: ft3.id, prerequisiteId: ft1.id }, // Flexbox requires HTML
      { topicId: ft4.id, prerequisiteId: ft3.id }, // Grid requires Flexbox
      { topicId: ft5.id, prerequisiteId: ft3.id }, // Tailwind requires Flexbox
      { topicId: ft6.id, prerequisiteId: ft5.id }, // Customizing Tailwind requires Tailwind
      { topicId: ft7.id, prerequisiteId: ft1.id }, // JS requires HTML
      { topicId: ft8.id, prerequisiteId: ft7.id }, // Async JS requires JS
      { topicId: ft9.id, prerequisiteId: ft8.id }, // React requires Async JS
      { topicId: ft9.id, prerequisiteId: ft5.id }, // React requires Tailwind
      { topicId: ft10.id, prerequisiteId: ft9.id }, // State requires React Components
      { topicId: ft11.id, prerequisiteId: ft10.id }, // Hooks requires State
      { topicId: ft12.id, prerequisiteId: ft11.id }, // TanStack Query requires Hooks
      { topicId: ft13.id, prerequisiteId: ft12.id }, // Next.js requires TanStack Query
    ],
  });

  // Frontend Resources
  await prisma.resource.createMany({
    data: [
      {
        topicId: ft1.id,
        title: 'MDN Web Docs: HTML Elements Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
        type: ResourceType.DOCS,
      },
      {
        topicId: ft3.id,
        title: 'CSS-Tricks: A Complete Guide to Flexbox',
        url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
        type: ResourceType.ARTICLE,
      },
      {
        topicId: ft5.id,
        title: 'Tailwind CSS Official Documentation',
        url: 'https://tailwindcss.com/docs',
        type: ResourceType.DOCS,
      },
      {
        topicId: ft7.id,
        title: 'JavaScript.info: The Modern JavaScript Tutorial',
        url: 'https://javascript.info/',
        type: ResourceType.COURSE,
      },
      {
        topicId: ft9.id,
        title: 'React.dev: Quick Start & Describing the UI',
        url: 'https://react.dev/learn',
        type: ResourceType.DOCS,
      },
      {
        topicId: ft11.id,
        title: 'React.dev: Built-in React Hooks Guide',
        url: 'https://react.dev/reference/react/hooks',
        type: ResourceType.DOCS,
      },
      {
        topicId: ft12.id,
        title: 'TanStack Query Official Guides',
        url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
        type: ResourceType.DOCS,
      },
      {
        topicId: ft13.id,
        title: 'Next.js 14 Official Learn Course',
        url: 'https://nextjs.org/learn',
        type: ResourceType.COURSE,
      },
    ],
  });

  // ==========================================
  // 6. SEED INITIAL PROGRESS FOR TEST USER
  // ==========================================
  // Complete initial Java topics
  await prisma.userProgress.create({
    data: {
      userId: testUser.id,
      topicId: jt1.id,
      status: ProgressStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  await prisma.userProgress.create({
    data: {
      userId: testUser.id,
      topicId: jt2.id,
      status: ProgressStatus.IN_PROGRESS,
    },
  });

  // Complete initial Frontend topics
  await prisma.userProgress.create({
    data: {
      userId: testUser.id,
      topicId: ft1.id,
      status: ProgressStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  await prisma.userProgress.create({
    data: {
      userId: testUser.id,
      topicId: ft3.id,
      status: ProgressStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  await prisma.userProgress.create({
    data: {
      userId: testUser.id,
      topicId: ft5.id,
      status: ProgressStatus.IN_PROGRESS,
    },
  });

  console.log('✅ DevPath database seeded successfully with Java & Frontend curricula!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
