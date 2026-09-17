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

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

const passwordRules = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
];

export default function SignupPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const currentPassword = watch('password', '');

  const onSubmit = async (data: SignupForm) => {
    setServerError('');
    try {
      await registerUser(data.email, data.password, data.name);
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBFA]">
      {/* Left branding panel (Orbit warm gradient) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 xl:w-[48%] relative overflow-hidden bg-gradient-to-br from-orange-100 via-[#FFF7F2] to-blue-50 flex-col justify-between p-12 border-r border-gray-100"
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
            <span>100% Free • Interactive Learning</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#0D0D54] leading-tight font-heading">
            Your Developer <br />
            <span className="text-[#EE5902]">Future Starts Here.</span>
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Gain mastery in Enterprise Java, Spring Boot, and Modern React. Explore both stacks seamlessly with verified DAG prerequisites.
          </p>

          <ul className="space-y-3.5 text-sm text-[#1B1B38]">
            {[
              'Comprehensive Java 21 & Spring Boot 3 enterprise curriculum',
              'HTML5, Modern CSS, Tailwind CSS & React 18 frontend',
              'Interactive React Flow DAG skill graph with prerequisite enforcement',
              'Track learning streaks and earn verifiable milestones',
            ].map((feat) => (
              <li key={feat} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#EE5902] flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-gray-500 text-xs">
          © {new Date().getFullYear()} DevPath. Empowering developers worldwide.
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

          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D0D54] tracking-tight font-heading">
              Create Free Account
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Start mastering Java backend & Modern frontend today
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Ada Lovelace"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="ada@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1.5">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
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

              {/* Password strength indicators */}
              {currentPassword && (
                <div className="flex gap-2 pt-1">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(currentPassword);
                    return (
                      <span
                        key={rule.label}
                        className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors flex items-center gap-1 ${
                          passed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        {rule.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

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
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Get Started & Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-[#EE5902] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
