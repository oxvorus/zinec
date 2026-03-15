'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white px-6 py-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Manajemen Pengguna</h1>
            <p className="text-sm text-zinc-600 mt-1">Kelola pengguna dan penjual di platform</p>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-500">Fitur manajemen pengguna akan segera hadir</p>
        </div>
      </div>
    </div>
  );
}
