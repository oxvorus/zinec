import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
