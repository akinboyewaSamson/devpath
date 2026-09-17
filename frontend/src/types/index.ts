export type Role = 'USER' | 'ADMIN';

export type TopicLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type ResourceType = 'ARTICLE' | 'VIDEO' | 'DOCS' | 'COURSE' | 'PRACTICE';

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: Role;
  currentTrackId?: string | null;
  streakDays: number;
  lastActiveDate?: string | null;
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

export interface Track {
  id: string;
  name: 'frontend' | 'backend' | string;
  title: string;
  description: string;
  createdAt: string;
  _count?: {
    roadmaps: number;
    users: number;
  };
}

export interface Resource {
  id: string;
  topicId: string;
  type: ResourceType;
  url: string;
  title: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  topicIds: string[];
}

export interface TopicDAGNode {
  id: string;
  title: string;
  description: string;
  level: TopicLevel;
  order: number;
  estimatedHours: number;
  milestoneId?: string | null;
  milestoneTitle?: string | null;
  resources: Resource[];
  prerequisiteTopicIds: string[];
  dependentTopicIds: string[];
  dagLayer: number;
  userProgress: {
    status: ProgressStatus;
    completedAt?: string | null;
  };
}

export interface RoadmapDAG {
  id: string;
  trackId: string;
  trackName: string;
  trackTitle: string;
  title: string;
  description: string;
  version: string;
  isCurrent: boolean;
  totalTopics: number;
  totalEstimatedHours: number;
  milestones: Milestone[];
  graph: {
    nodes: TopicDAGNode[];
    edges: Array<{ from: string; to: string }>;
  };
}

export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    streakDays: number;
    lastActiveDate?: string | null;
  };
  activeTrack: {
    id: string;
    name: string;
    title: string;
    description: string;
  } | null;
  activeRoadmap: {
    id: string;
    title: string;
    version: string;
  } | null;
  tracks?: Array<{
    id: string;
    name: string;
    title: string;
    description: string;
    roadmapId: string | null;
    roadmapTitle: string | null;
    progress: {
      overallPercentage: number;
      completedTopics: number;
      totalTopics: number;
      remainingHours: number;
      byLevel: Record<
        TopicLevel,
        { total: number; completed: number; percentage: number }
      >;
    } | null;
  }>;
  progress: {
    overallPercentage: number;
    completedTopics: number;
    totalTopics: number;
    remainingHours: number;
    byLevel: Record<
      TopicLevel,
      { total: number; completed: number; percentage: number }
    >;
  };
  currentTopic: TopicDAGNode | null;
  recentlyCompletedTopics: Array<{
    id: string;
    title: string;
    level: TopicLevel;
    milestone?: string | null;
    completedAt?: string | null;
  }>;
}
