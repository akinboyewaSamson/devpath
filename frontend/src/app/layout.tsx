import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'DevPath — Structured Learning Roadmaps for Software Engineers',
  description:
    'Interactive DAG skill graphs, verified prerequisite-aware progression, and gamified roadmap tracking for developers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-surfaceLight dark:bg-darkBg text-textLight dark:text-textDark transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
