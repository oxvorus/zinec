'use client';

import { BarChart3, MapPin, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
            <p className="text-sm text-zinc-600 mt-1">Kelola dan pantau platform Zinec Digital</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">Akses Cepat</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Analytics */}
            <Link
              href="/admin/analytics"
              className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg hover:border-blue-300"
            >
              <div className="mb-4 flex items-center justify-between">
                <MapPin className="h-10 w-10 text-blue-600 opacity-20 group-hover:opacity-30 transition-all" />
                <span className="text-xs font-semibold text-blue-600">Baru</span>
              </div>
              <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                Analytics Marketing
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Lihat data lokasi pengunjung dan optimasi iklan untuk daerah terbaik
              </p>
            </Link>

            {/* Users Management */}
            <Link
              href="/admin/users"
              className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg hover:border-cyan-300"
            >
              <div className="mb-4">
                <Users className="h-10 w-10 text-cyan-600 opacity-20 group-hover:opacity-30 transition-all" />
              </div>
              <h3 className="font-semibold text-zinc-900 group-hover:text-cyan-600 transition-colors">
                Manajemen Pengguna
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Kelola akun pengguna, penjual, dan pembeli di platform
              </p>
            </Link>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg hover:border-purple-300"
            >
              <div className="mb-4">
                <Settings className="h-10 w-10 text-purple-600 opacity-20 group-hover:opacity-30 transition-all" />
              </div>
              <h3 className="font-semibold text-zinc-900 group-hover:text-purple-600 transition-colors">
                Pengaturan Platform
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Konfigurasi sistem, integrasi, dan preferensi platform
              </p>
            </Link>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tentang Analytics
            </h3>
            <p className="mt-2 text-sm text-blue-800">
              Sistem tracking lokasi secara otomatis mengumpulkan data dari setiap pengunjung.
              Data ini membantu Anda mengidentifikasi daerah dengan performa terbaik untuk
              strategi pemasaran dan iklan yang lebih efektif.
            </p>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="font-semibold text-green-900 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Data yang Dikumpulkan
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-green-800">
              <li>• Provinsi dan kota pengunjung</li>
              <li>• Jumlah kunjungan dan pengunjung unik</li>
              <li>• Jumlah order dan konversi per daerah</li>
              <li>• Pembeda antara pembeli dan penjual</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
