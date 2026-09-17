'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Flame,
  GitFork,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { Navbar } from '@/components/ui/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Must be at least 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, refreshUser, isLoading } = useAuth();
  const router = useRouter();
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '', avatarUrl: user?.avatarUrl ?? '' },
  });

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (data: ProfileForm) => {
    setProfileSuccess(''); setProfileError('');
    try {
      await api.updateProfile({ name: data.name, avatarUrl: data.avatarUrl || undefined });
      await refreshUser();
      setProfileSuccess('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPasswordSuccess(''); setPasswordError('');
    try {
      const res = await api.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      setPasswordSuccess(res.message || 'Password changed successfully!');
      passwordForm.reset();
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBFA]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#EE5902] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBFA]">
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header Card */}
          <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#EE5902] text-white flex items-center justify-center text-3xl font-extrabold shadow-md font-heading">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h1 className="text-2xl font-bold text-[#0D0D54] font-heading">{user?.name}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFE6] border border-[#FEBF9A] text-xs font-bold text-[#EE5902]">
                  <Flame className="w-3.5 h-3.5 fill-[#EE5902]" />
                  {user?.streakDays ?? 1} Day Streak
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6F6] border border-[#BEDADA] text-xs font-bold text-[#376262]">
                  <GitFork className="w-3.5 h-3.5" />
                  Dual-Stack Learner
                </span>
              </div>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0D0D54] font-heading">Personal Information</h2>
              <p className="text-xs text-gray-500 mt-1">Update your display name and public credentials</p>
            </div>

            {profileSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Ada Lovelace"
                error={profileForm.formState.errors.name?.message}
                {...profileForm.register('name')}
              />

              <Input
                label="Avatar URL (optional)"
                placeholder="https://..."
                error={profileForm.formState.errors.avatarUrl?.message}
                {...profileForm.register('avatarUrl')}
              />

              <Button
                type="submit"
                variant="primary"
                className="rounded-xl px-6"
                disabled={profileForm.formState.isSubmitting}
              >
                {profileForm.formState.isSubmitting ? 'Saving Changes...' : 'Save Profile'}
              </Button>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0D0D54] font-heading">Security & Password</h2>
              <p className="text-xs text-gray-500 mt-1">Change your password to keep your account safe</p>
            </div>

            {passwordSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={passwordForm.formState.errors.currentPassword?.message}
                  {...passwordForm.register('currentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showNew ? 'text' : 'password'}
                  placeholder="At least 8 characters with 1 uppercase & 1 number"
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="primary"
                className="rounded-xl px-6"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
