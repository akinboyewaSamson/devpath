'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight,
  GitFork,
  Layers,
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { Track } from '@/types';
import { Navbar } from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);

  useEffect(() => {
    api.getTracks()
      .then(setTracks)
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingTracks(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEFE6] border border-[#FEBF9A] text-[#EE5902] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Stack Learning Paths</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D0D54] tracking-tight font-heading">
            Enterprise Developer Curricula
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Choose either track or master both simultaneously. Every topic features step-by-step DAG prerequisite checking and verified industry learning sources.
          </p>
        </div>

        {/* Dual Stack Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Java Backend Track */}
          <div className="rounded-3xl border-2 border-[#FEBF9A] bg-white p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFEFE6] border border-[#FEBF9A] flex items-center justify-center text-[#EE5902]">
                  <Server className="w-7 h-7" />
                </div>
                <Badge variant="primary" className="text-xs px-3 py-1 font-bold">
                  Java 21 & Spring Boot
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-[#0D0D54] font-heading mb-2">
                Java Backend Engineering
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Master enterprise software engineering from core Java OOP principles to high-throughput distributed systems with Spring Boot 3, PostgreSQL, and Spring Security.
              </p>

              <div className="space-y-3 mb-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Curriculum Competencies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
                  {[
                    'Core Java 21 & OOP Architecture',
                    'Collections API & Generic Types',
                    'Modern Streams & Lambda Pipelines',
                    'JVM Memory & Virtual Threads',
                    'Builds with Maven & Gradle',
                    'JUnit 5, AssertJ & Mockito',
                    'Spring Boot 3 RESTful APIs',
                    'Spring Data JPA & PostgreSQL',
                    'Spring Security & JWT Filters',
                    'Microservices & Kafka Messaging',
                  ].map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#EE5902] shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Clock className="w-4 h-4 text-[#EE5902]" />
                <span>~90 Hours of Interactive Content</span>
              </div>

              <Link href="/roadmap?track=backend">
                <Button variant="primary" className="rounded-xl flex items-center gap-2">
                  <span>Explore Java Roadmap</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Modern Frontend Track */}
          <div className="rounded-3xl border-2 border-[#BEDADA] bg-white p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EFF6F6] border border-[#BEDADA] flex items-center justify-center text-[#376262]">
                  <Code2 className="w-7 h-7" />
                </div>
                <Badge level="BEGINNER" className="text-xs px-3 py-1 font-bold">
                  HTML, CSS, Tailwind & React
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-[#0D0D54] font-heading mb-2">
                Frontend Engineering
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Master modern web development from semantic HTML5 and responsive CSS Grid/Flexbox to utility-first styling with Tailwind CSS and reactive applications with React and Next.js 14.
              </p>

              <div className="space-y-3 mb-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Curriculum Competencies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
                  {[
                    'Semantic HTML5 & Document Outlines',
                    'Web Accessibility (a11y) & SEO',
                    'CSS Box Model & Flexbox Mastery',
                    'CSS Grid & Responsive Layouts',
                    'Tailwind CSS Utility-First Styling',
                    'Modern ES6+ JavaScript Core',
                    'Async JS: Promises & Fetch API',
                    'React 18 Components & State',
                    'Hooks: useEffect, useMemo, custom hooks',
                    'TanStack Query & Next.js 14 App Router',
                  ].map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#376262] shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Clock className="w-4 h-4 text-[#376262]" />
                <span>~80 Hours of Interactive Content</span>
              </div>

              <Link href="/roadmap?track=frontend">
                <Button className="bg-[#376262] hover:bg-[#2A4B4B] text-white rounded-xl flex items-center gap-2">
                  <span>Explore Frontend Roadmap</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Why DevPath Feature Callout (Orbit Inspired) */}
        <div className="rounded-3xl bg-[#FDFBFA] border border-gray-200 p-8 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-[#0D0D54] font-heading">
              Why DevPath&apos;s Curriculum Works
            </h3>
            <p className="text-sm text-gray-500">
              Unlike generic tutorials, DevPath enforces prerequisite mastery through a verified Directed Acyclic Graph (DAG).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFEFE6] text-[#EE5902] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-[#0D0D54]">Strict Prerequisites</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                You can never jump ahead into complex frameworks without mastering fundamentals first.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6F6] text-[#376262] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-[#0D0D54]">Curated Industry Docs</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Direct verified references from Oracle, Baeldung, Spring.io, React.dev, Tailwind, and MDN.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#F8ECF8] text-[#70296E] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-[#0D0D54]">Dual-Stack Freedom</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Seamlessly progress through Java backend and React frontend without being locked into one track.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
