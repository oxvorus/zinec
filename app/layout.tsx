'use client';

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { useLocationTracking } from '@/hooks/useLocationTracking';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zinec Digital - Marketplace Jasa Akademik',
  description: 'Platform terpercaya menghubungkan mahasiswa dengan asisten profesional untuk bantuan akademik',
  keywords: ['jasa akademik', 'essay', 'tutor', 'homework', 'mahasiswa'],
  openGraph: {
    title: 'Zinec Digital',
    description: 'Platform terpercaya menghubungkan mahasiswa dengan asisten profesional',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize location tracking on all pages
  useLocationTracking({
    page_visited: 'root',
  });

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

export default RootLayoutContent;
