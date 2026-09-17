'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight, GitFork, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillTestAccount = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBFA]">
      {/* Left branding panel (Orbit style warm gradient) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-orange-100 via-[#FFF7F2] to-blue-50 flex-col justify-between p-12 border-r border-gray-100"
      >
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EE5902] text-white flex items-center justify-center shadow-md">
              <GitFork className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#0D0D54] font-heading">
              DevPath<span className="text-[#EE5902]">.</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFEFE6] border border-[#FEBF9A] text-[#EE5902] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Stack Developer Journey</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#0D0D54] leading-tight font-heading">
            Learn Real Skills. <br />
            <span className="text-[#EE5902]">Master Both Stacks.</span>
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Step-by-step DAG roadmaps with verified prerequisite logic. Pick up right where you left off on Java Backend or Modern React Frontend.
          </p>

          {/* Dual stack preview chips */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-[#EE5902] uppercase tracking-wider mb-1">☕ Backend Track</div>
              <div className="text-sm font-semibold text-[#0D0D54]">Java 21 & Spring Boot</div>
              <p className="text-xs text-gray-500 mt-1">JVM, Concurrency, PostgreSQL, JPA</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-[#376262] uppercase tracking-wider mb-1">⚛️ Frontend Track</div>
              <div className="text-sm font-semibold text-[#0D0D54]">Modern Web & React</div>
              <p className="text-xs text-gray-500 mt-1">HTML5, CSS Grid, Tailwind, Next.js 14</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-gray-500 text-xs">
          © {new Date().getFullYear()} DevPath. The Future of Developer Learning.
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(13,13,84,0.06)]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#EE5902] text-white flex items-center justify-center shadow-sm">
              <GitFork className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl text-[#0D0D54]">
              DevPath<span className="text-[#EE5902]">.</span>
            </span>
          </div>

          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D0D54] tracking-tight font-heading">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Sign in to resume your learning roadmaps and track streaks
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 rounded-2xl bg-[#FDFBFA] border border-gray-200 text-xs space-y-2">
            <div className="font-semibold text-gray-600 flex items-center gap-1">
              <span>Quick Login (Demo Accounts):</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillTestAccount('learner@devpath.io', 'UserPass123!')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-[#FFEFE6] hover:text-[#EE5902] border border-gray-200 rounded-lg font-medium transition-colors text-center"
              >
                Learner Account
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount('admin@devpath.io', 'AdminPass123!')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-[#FFEFE6] hover:text-[#EE5902] border border-gray-200 rounded-lg font-medium transition-colors text-center"
              >
                Admin Account
              </button>
            </div>
          </div>

          {serverError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1.5">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#EE5902] font-semibold hover:underline">
              Create free account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
