'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitFork,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code2,
  Server,
  Flame,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const heroPhrases = [
  'Java 21 & Spring Boot',
  'HTML, CSS & Tailwind',
  'React 18 & Next.js 14',
  'Real Prerequisites',
  'Without Tutorial Hell',
];

export default function LandingPage() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBFA] text-[#1B1B38]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION (GetOrbit style warm gradient) */}
        <section className="relative overflow-hidden bg-gradient-to-r from-orange-100/90 via-[#FFF7F2] to-blue-50/80 py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-orange-100">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Hero Content */}
            <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl lg:max-w-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-orange-200 text-[#EE5902] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Future of Developer Learning</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0D0D54] leading-[1.15] font-heading">
                The Future Of Work <br />
                Starts With{' '}
                <span className="text-[#EE5902] inline-block min-w-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phraseIndex}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block"
                    >
                      {heroPhrases[phraseIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Learn real skills, gain experience, and discover your ideal career path. Master both <strong>Java Enterprise Backend</strong> and <strong>Modern Frontend (HTML, CSS, Tailwind & React)</strong> with verified prerequisite tracking.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#EE5902] hover:bg-[#D44E02] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href="/tracks">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white border-gray-300 hover:border-[#EE5902] text-[#0D0D54] px-7 py-3.5 rounded-xl font-bold transition-all"
                  >
                    <span>Explore Both Stacks</span>
                  </Button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#EE5902]" /> 100% Free
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#EE5902]" /> DAG Prerequisites
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#EE5902]" /> Curated Docs
                </span>
              </div>
            </div>

            {/* Right Hero Preview Card */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/60 shadow-[0_12px_40px_rgba(13,13,84,0.08)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFEFE6] text-[#EE5902] flex items-center justify-center font-bold">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#0D0D54]">DevPath Live Curriculum</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    Dual-Track
                  </span>
                </div>

                {/* Track Preview items */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FFEFE6]/70 border border-[#FEBF9A] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white text-[#EE5902] flex items-center justify-center shadow-xs">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D0D54]">Java Backend Track</div>
                        <div className="text-[11px] text-gray-500">Java 21, JVM, Spring Boot, JPA</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#EE5902]">13 Topics</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFF6F6]/70 border border-[#BEDADA] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white text-[#376262] flex items-center justify-center shadow-xs">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D0D54]">Frontend Track</div>
                        <div className="text-[11px] text-gray-500">HTML5, CSS, Tailwind, React</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#376262]">13 Topics</span>
                  </div>
                </div>

                {/* Micro checklist */}
                <div className="pt-2 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Server-enforced prerequisite dependencies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Direct links to Oracle, Baeldung, React.dev & MDN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Daily activity streak tracking</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/login" className="block">
                    <Button variant="primary" className="w-full rounded-xl py-2.5 text-xs font-bold">
                      Enter Learner Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 FEATURE CARDS (GetOrbit Style) */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D54] font-heading">
                What sets <span className="text-[#EE5902]">DevPath</span> apart:
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                A structured learning platform built from first principles for modern software developers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Teal */}
              <div className="rounded-2xl border border-[#BEDADA] bg-[#EFF6F6] p-6 flex flex-col justify-between h-[280px] shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white text-[#376262] flex items-center justify-center mb-4 shadow-xs">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#376262] mb-2 font-heading">
                    Curated Industry Sources
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    No low-quality blog posts. Every topic is grounded in official docs from Oracle, Baeldung, Spring.io, React.dev, and MDN.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#376262] flex items-center gap-1">
                  Verified Resources <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Card 2: Lilac/Purple */}
              <div className="rounded-2xl border border-[#E4B4E2] bg-[#F8ECF8] p-6 flex flex-col justify-between h-[280px] shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white text-[#70296E] flex items-center justify-center mb-4 shadow-xs">
                    <GitFork className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#70296E] mb-2 font-heading">
                    DAG Prerequisite Engine
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Topics exist in a Directed Acyclic Graph. The server blocks premature skipping so foundational concepts are truly mastered.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#70296E] flex items-center gap-1">
                  Zero Knowledge Gaps <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Card 3: Orange */}
              <div className="rounded-2xl border border-[#FEBF9A] bg-[#FFEFE6] p-6 flex flex-col justify-between h-[280px] shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white text-[#EE5902] flex items-center justify-center mb-4 shadow-xs">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#EE5902] mb-2 font-heading">
                    Dual-Stack Flexibility
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    View and advance through both Java Backend and React Frontend simultaneously without locking into a single track.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#EE5902] flex items-center gap-1">
                  Full-Stack Freedom <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Card 4: Indigo */}
              <div className="rounded-2xl border border-[#A7A7F1] bg-[#EEEEF7] p-6 flex flex-col justify-between h-[280px] shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white text-[#151584] flex items-center justify-center mb-4 shadow-xs">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#151584] mb-2 font-heading">
                    Verifiable Progress
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Track consecutive daily streaks, complete milestones, and build a verified portfolio of technical competencies.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#151584] flex items-center gap-1">
                  Streak Gamification <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO USE DEVPATH SECTION */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FDFBFA]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D0D54] font-heading">
                How To Use <span className="text-[#EE5902]">DevPath</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Four simple steps to structured engineering mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Create Free Account', desc: 'Sign up in seconds and get instant access to the dual-stack dashboard.' },
                { step: '2', title: 'Explore Skill Graph', desc: 'Browse the interactive DAG roadmaps for Java backend and React frontend.' },
                { step: '3', title: 'Study Verified Resources', desc: 'Read curated articles and official docs tailored to each topic.' },
                { step: '4', title: 'Unlock Milestones', desc: 'Mark topics complete to satisfy prerequisites and advance to expert levels.' },
              ].map((item) => (
                <div key={item.step} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFEFE6] text-[#EE5902] font-extrabold text-lg flex items-center justify-center font-heading">
                    {item.step}
                  </div>
                  <h4 className="text-base font-bold text-[#0D0D54] font-heading">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-center">
              <Link href="/signup">
                <Button size="lg" variant="primary" className="rounded-xl px-10 py-3.5 font-bold shadow-md">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
