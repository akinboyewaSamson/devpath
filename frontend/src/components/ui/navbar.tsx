'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, LayoutDashboard, GitFork, BookOpen, LogOut, Menu, X, Shield, Compass } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo (Orbit aesthetic) */}
        <div className="flex items-center gap-8">
          <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#FFEFE6] border border-[#FEBF9A] flex items-center justify-center text-[#EE5902] shadow-sm group-hover:scale-105 transition-transform">
              <GitFork className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-[#0D0D54] flex items-center">
                DevPath<span className="text-[#EE5902] text-2xl leading-none ml-0.5">.</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-600 -mt-1">
                Developer Roadmaps
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                    pathname === '/dashboard'
                      ? 'text-[#EE5902] bg-[#FFEFE6] font-semibold'
                      : 'text-gray-600 hover:text-[#0D0D54] hover:bg-gray-50',
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/roadmap"
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                    pathname.startsWith('/roadmap')
                      ? 'text-[#EE5902] bg-[#FFEFE6] font-semibold'
                      : 'text-gray-600 hover:text-[#0D0D54] hover:bg-gray-50',
                  )}
                >
                  <GitFork className="w-4 h-4" />
                  Roadmaps
                </Link>

                <Link
                  href="/tracks"
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                    pathname === '/tracks'
                      ? 'text-[#EE5902] bg-[#FFEFE6] font-semibold'
                      : 'text-gray-600 hover:text-[#0D0D54] hover:bg-gray-50',
                  )}
                >
                  <BookOpen className="w-4 h-4" />
                  Curriculum
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={cn(
                      'px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 text-purple-600',
                      pathname === '/admin' ? 'bg-purple-50 font-semibold' : 'hover:bg-purple-50',
                    )}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === '/' ? 'text-[#EE5902] font-semibold' : 'text-gray-600 hover:text-[#0D0D54]',
                  )}
                >
                  Home
                </Link>
                <Link
                  href="/tracks"
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === '/tracks' ? 'text-[#EE5902] font-semibold' : 'text-gray-600 hover:text-[#0D0D54]',
                  )}
                >
                  Courses & Stacks
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Gamification Streak Pill */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFEFE6] border border-[#FEBF9A] text-[#EE5902] text-xs font-semibold shadow-sm"
                title={`${user.streakDays} day activity streak`}
              >
                <Flame className="w-3.5 h-3.5 fill-[#EE5902] text-[#EE5902]" />
                <span>{user.streakDays}d streak</span>
              </div>

              {/* Profile Link */}
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-full border border-gray-200 hover:border-[#EE5902] hover:bg-[#FFF7F2] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#EE5902] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-[#1B1B38] max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#EE5902] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-[#EE5902] hover:bg-[#D44E02] text-white rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#EE5902] hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#EE5902] hover:bg-[#FFF7F2]"
              >
                Dashboard
              </Link>
              <Link
                href="/roadmap"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#EE5902] hover:bg-[#FFF7F2]"
              >
                Roadmaps
              </Link>
              <Link
                href="/tracks"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#EE5902] hover:bg-[#FFF7F2]"
              >
                Curriculum
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#EE5902] hover:bg-[#FFF7F2]"
              >
                Profile Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#EE5902]"
              >
                Home
              </Link>
              <Link
                href="/tracks"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#EE5902]"
              >
                Courses & Stacks
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium bg-[#EE5902] text-white rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
