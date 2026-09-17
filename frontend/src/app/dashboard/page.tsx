'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Flame,
  GitFork,
  CheckCircle2,
  Clock,
  ChevronRight,
  BookOpen,
  Zap,
  LayoutDashboard,
  ExternalLink,
  Code2,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { DashboardData, TopicLevel } from '@/types';
import { Navbar } from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedStack, setSelectedStack] = useState<'all' | 'backend' | 'frontend'>('all');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setIsLoadingData(true);
    api.getDashboard()
      .then(setData)
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setIsLoadingData(false));
  }, [user]);

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBFA]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#EE5902] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Find backend and frontend progress from returned tracks
  const backendTrack = data?.tracks?.find((t) => t.name === 'backend');
  const frontendTrack = data?.tracks?.find((t) => t.name === 'frontend');

  const backendPercentage = backendTrack?.progress?.overallPercentage ?? 0;
  const frontendPercentage = frontendTrack?.progress?.overallPercentage ?? 0;
  const combinedPercentage = Math.round((backendPercentage + frontendPercentage) / 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
        {/* Welcome & Streak Banner (GetOrbit style) */}
        <div className="rounded-3xl bg-gradient-to-r from-orange-100/80 via-[#FFF7F2] to-blue-50/60 p-6 sm:p-8 border border-orange-200/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-orange-200 text-xs font-semibold text-[#EE5902] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Developer Path</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D0D54] tracking-tight font-heading">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Track your progress seamlessly across both <strong>Java Enterprise Backend</strong> and <strong>Modern Frontend (HTML, CSS, Tailwind & React)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#FFEFE6] border border-[#FEBF9A] flex items-center justify-center text-[#EE5902]">
                <Flame className="w-6 h-6 fill-[#EE5902]" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Learning Streak</div>
                <div className="text-xl font-bold text-[#0D0D54]">{user?.streakDays ?? 1} Days Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Stack Tab Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200">
            <button
              onClick={() => setSelectedStack('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedStack === 'all'
                  ? 'bg-white text-[#0D0D54] shadow-sm'
                  : 'text-gray-600 hover:text-[#0D0D54]'
              }`}
            >
              <Layers className="w-4 h-4" />
              All Stacks Overview
            </button>
            <button
              onClick={() => setSelectedStack('backend')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedStack === 'backend'
                  ? 'bg-[#EE5902] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#EE5902]'
              }`}
            >
              <Server className="w-4 h-4" />
              Java Backend
            </button>
            <button
              onClick={() => setSelectedStack('frontend')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedStack === 'frontend'
                  ? 'bg-[#376262] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#376262]'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Modern Frontend
            </button>
          </div>

          <Link href="/roadmap">
            <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5 border-gray-300">
              <GitFork className="w-4 h-4 text-[#EE5902]" />
              <span>Interactive Skill Graph</span>
            </Button>
          </Link>
        </div>

        {/* Both Stacks Spotlight Cards (Side-by-Side Dual Stack) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Java Backend Card */}
          <div
            className={`rounded-3xl border transition-all p-6 bg-white relative overflow-hidden shadow-sm ${
              selectedStack === 'frontend' ? 'opacity-50 grayscale hover:opacity-80 hover:grayscale-0' : 'border-orange-200'
            }`}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFEFE6] rounded-bl-full pointer-events-none opacity-60" />
            <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEFE6] border border-[#FEBF9A] flex items-center justify-center text-[#EE5902]">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#EE5902] uppercase tracking-wider">Enterprise Track</div>
                  <h3 className="text-xl font-bold text-[#0D0D54] font-heading">Java Backend Engineering</h3>
                </div>
              </div>
              <Badge variant="primary">
                {Math.round(backendPercentage)}% Done
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Master Java 21, JVM architecture, Virtual Threads, Spring Boot 3, Spring Data JPA, PostgreSQL, and Spring Security.
            </p>

            {/* Progress bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Curriculum Progress</span>
                <span>{backendTrack?.progress?.completedTopics ?? 1} of {backendTrack?.progress?.totalTopics ?? 13} Topics</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EE5902] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(5, backendPercentage)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{backendTrack?.progress?.remainingHours ?? 80}h estimated left</span>
              </div>
              <Link href="/roadmap?track=backend">
                <Button size="sm" className="bg-[#EE5902] hover:bg-[#D44E02] text-white rounded-xl">
                  Open Java Roadmap
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Frontend Card */}
          <div
            className={`rounded-3xl border transition-all p-6 bg-white relative overflow-hidden shadow-sm ${
              selectedStack === 'backend' ? 'opacity-50 grayscale hover:opacity-80 hover:grayscale-0' : 'border-teal-200'
            }`}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#EFF6F6] rounded-bl-full pointer-events-none opacity-60" />
            <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6F6] border border-[#BEDADA] flex items-center justify-center text-[#376262]">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#376262] uppercase tracking-wider">Web Development</div>
                  <h3 className="text-xl font-bold text-[#0D0D54] font-heading">Frontend Engineering</h3>
                </div>
              </div>
              <Badge level="BEGINNER">
                {Math.round(frontendPercentage)}% Done
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Master Semantic HTML5, CSS Grid, Flexbox, Tailwind CSS, Modern ES6+ JavaScript, React component patterns, and Next.js 14.
            </p>

            {/* Progress bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Curriculum Progress</span>
                <span>{frontendTrack?.progress?.completedTopics ?? 2} of {frontendTrack?.progress?.totalTopics ?? 13} Topics</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#376262] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(5, frontendPercentage)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{frontendTrack?.progress?.remainingHours ?? 75}h estimated left</span>
              </div>
              <Link href="/roadmap?track=frontend">
                <Button size="sm" className="bg-[#376262] hover:bg-[#2A4B4B] text-white rounded-xl">
                  Open Frontend Roadmap
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Current In-Progress Topic with Curated Resources */}
        {data?.currentTopic && (
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EE5902] animate-ping" />
                  <span className="text-xs font-bold text-[#EE5902] uppercase tracking-wider">Active Study Focus</span>
                  <Badge level={data.currentTopic.level}>{data.currentTopic.level}</Badge>
                </div>
                <h2 className="text-2xl font-bold text-[#0D0D54] font-heading">
                  {data.currentTopic.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 max-w-3xl leading-relaxed">
                  {data.currentTopic.description}
                </p>
              </div>

              <Link href={`/roadmap?topic=${data.currentTopic.id}`}>
                <Button variant="primary" className="rounded-xl flex items-center gap-1.5 shrink-0">
                  <span>Continue on Graph</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Curated Resources list */}
            {data.currentTopic.resources && data.currentTopic.resources.length > 0 && (
              <div className="mt-4 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Recommended Learning Resources
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.currentTopic.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl border border-gray-200 bg-[#FDFBFA] hover:border-[#FEBF9A] hover:bg-white transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#EE5902] uppercase">{res.type}</span>
                        <div className="text-sm font-semibold text-[#0D0D54] group-hover:text-[#EE5902] transition-colors line-clamp-1">
                          {res.title}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#EE5902] transition-colors shrink-0 mt-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recently Completed Topics */}
        {data?.recentlyCompletedTopics && data.recentlyCompletedTopics.length > 0 && (
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#0D0D54] mb-4 font-heading flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Recently Completed Milestones</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.recentlyCompletedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#FDFBFA] flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-[#0D0D54]">{topic.title}</div>
                    <div className="text-xs text-gray-500">{topic.milestone || 'Foundation'}</div>
                  </div>
                  <Badge level={topic.level}>{topic.level}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
