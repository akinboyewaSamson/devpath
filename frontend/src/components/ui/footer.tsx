import React from 'react';
import Link from 'next/link';
import { GitFork, BookOpen, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1B1B38] text-white pt-14 pb-10 border-t border-[#2A2A54]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EE5902] text-white flex items-center justify-center shadow-sm">
                <GitFork className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white font-heading">
                DevPath<span className="text-[#EE5902]">.</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Master Full-Stack Engineering with step-by-step DAG roadmaps covering Java enterprise backend and modern HTML, CSS, Tailwind & React frontend.
            </p>
            <div className="text-xs text-orange-300 font-medium">
              Dual-Stack Mastery • Java & Modern Web
            </div>
          </div>

          {/* Stacks */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Learning Tracks
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>☕ Java & Spring Boot Roadmap</span>
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>⚛️ Modern Frontend (React & Tailwind)</span>
                </Link>
              </li>
              <li>
                <Link href="/tracks" className="hover:text-white transition-colors">
                  Explore All Curricula
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dual-Stack Dashboard
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Interactive DAG Skill Graph
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Learning Streaks & Profile
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:3000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Backend REST API</span>
                  <ExternalLink className="w-3 h-3 text-orange-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Curated Excellence
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Every topic features verified enterprise resources from Oracle, Baeldung, Spring.io, React.dev, Tailwind CSS, and MDN Web Docs.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} DevPath. Built for ambitious software developers.</p>
          <p className="flex items-center gap-1">
            Empowering the future of tech education
          </p>
        </div>
      </div>
    </footer>
  );
}
