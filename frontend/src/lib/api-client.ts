import {
  AuthResponse,
  DashboardData,
  ProgressStatus,
  RoadmapDAG,
  TokenPair,
  Track,
  User,
} from '@/types';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem('devpath_access_token') ||
      (getCookie('devpath_access_token') as string) ||
      null
    );
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem('devpath_refresh_token') ||
      (getCookie('devpath_refresh_token') as string) ||
      null
    );
  }

  public setTokens(tokens: TokenPair) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('devpath_access_token', tokens.accessToken);
    localStorage.setItem('devpath_refresh_token', tokens.refreshToken);
    setCookie('devpath_access_token', tokens.accessToken, {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    setCookie('devpath_refresh_token', tokens.refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
  }

  public clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('devpath_access_token');
    localStorage.removeItem('devpath_refresh_token');
    deleteCookie('devpath_access_token');
    deleteCookie('devpath_refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true,
  ): Promise<T> {
    const token = this.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && retry) {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const newTokens: TokenPair = await refreshRes.json();
            this.setTokens(newTokens);
            return this.request<T>(endpoint, options, false);
          }
        } catch {
          this.clearTokens();
        }
      }
      this.clearTokens();
    }

    if (!res.ok) {
      let errorJson: any;
      try {
        errorJson = await res.json();
      } catch {
        errorJson = { message: res.statusText || 'An unexpected error occurred' };
      }
      throw new Error(
        Array.isArray(errorJson.message)
          ? errorJson.message.join(', ')
          : errorJson.message || 'Request failed',
      );
    }

    // Return empty object for 204 or non-json
    if (res.status === 204) return {} as T;
    return res.json();
  }

  // Auth endpoints
  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setTokens(res.tokens);
    return res;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setTokens(res.tokens);
    return res;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      this.clearTokens();
    }
  }

  // Users & Profile
  async getProfile(): Promise<User> {
    return this.request<User>('/users/profile');
  }

  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tracks
  async getTracks(): Promise<Track[]> {
    return this.request<Track[]>('/tracks');
  }

  async selectTrack(trackId: string): Promise<User> {
    return this.request<User>('/tracks/select', {
      method: 'POST',
      body: JSON.stringify({ trackId }),
    });
  }

  // Roadmaps
  async getRoadmap(roadmapId: string): Promise<RoadmapDAG> {
    return this.request<RoadmapDAG>(`/roadmaps/${roadmapId}`);
  }

  async getTrackRoadmap(trackId: string): Promise<RoadmapDAG> {
    return this.request<RoadmapDAG>(`/roadmaps/track/${trackId}`);
  }

  // Progress
  async updateTopicProgress(
    topicId: string,
    status: ProgressStatus,
  ): Promise<{ progress: any; currentStreak: number }> {
    return this.request<{ progress: any; currentStreak: number }>(`/progress/${topicId}`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async getProgressSummary(roadmapId?: string): Promise<any> {
    const query = roadmapId ? `?roadmapId=${roadmapId}` : '';
    return this.request<any>(`/progress/summary${query}`);
  }

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/dashboard');
  }

  // Admin CRUD
  async createTrack(data: { name: string; title: string; description: string }): Promise<any> {
    return this.request('/admin/tracks', { method: 'POST', body: JSON.stringify(data) });
  }

  async deleteTrack(id: string): Promise<any> {
    return this.request(`/admin/tracks/${id}`, { method: 'DELETE' });
  }

  async createTopic(data: any): Promise<any> {
    return this.request('/admin/topics', { method: 'POST', body: JSON.stringify(data) });
  }

  async deleteTopic(id: string): Promise<any> {
    return this.request(`/admin/topics/${id}`, { method: 'DELETE' });
  }

  async addPrerequisite(topicId: string, prerequisiteId: string): Promise<any> {
    return this.request('/admin/prerequisites', {
      method: 'POST',
      body: JSON.stringify({ topicId, prerequisiteId }),
    });
  }

  async createResource(data: any): Promise<any> {
    return this.request('/admin/resources', { method: 'POST', body: JSON.stringify(data) });
  }
}

export const api = new ApiClient();
