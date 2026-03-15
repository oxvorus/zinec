'use client';

import { TrendingUp, Users, MapPin, ShoppingCart } from 'lucide-react';

interface LocationStats {
  province: string;
  city: string;
  total_visits: number;
  unique_ips: number;
  registered_users: number;
  sellers: number;
  buyers: number;
  total_orders: number;
  service_views: number;
  conversion_rate: number;
}

interface LocationStatsCardProps {
  stats: LocationStats;
  rank?: number;
}

export function LocationStatsCard({ stats, rank }: LocationStatsCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {rank && (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white">
                {rank}
              </span>
            )}
            <h3 className="text-lg font-semibold text-zinc-900">{stats.city}</h3>
          </div>
          <p className="text-sm text-zinc-500 flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {stats.province}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-zinc-600 mb-1">Kunjungan</p>
          <p className="text-lg font-bold text-blue-600">{stats.total_visits.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-cyan-50 p-3">
          <p className="text-xs text-zinc-600 mb-1">Pengunjung Unik</p>
          <p className="text-lg font-bold text-cyan-600">{stats.unique_ips.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-3">
          <p className="text-xs text-zinc-600 mb-1">Pengguna Terdaftar</p>
          <p className="text-lg font-bold text-purple-600">{stats.registered_users.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3">
          <p className="text-xs text-zinc-600 mb-1">Order</p>
          <p className="text-lg font-bold text-green-600">{stats.total_orders}</p>
        </div>
      </div>

      {/* User Breakdown & Conversion */}
      <div className="space-y-2 pt-3 border-t border-zinc-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">Pembeli / Penjual</span>
          <span className="font-semibold text-zinc-900">
            {stats.buyers} / {stats.sellers}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">Konversi</span>
          <span className="font-semibold flex items-center gap-1 text-zinc-900">
            <TrendingUp className="h-4 w-4 text-green-600" />
            {stats.conversion_rate}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">Layanan Dilihat</span>
          <span className="font-semibold text-zinc-900">{stats.service_views}</span>
        </div>
      </div>
    </div>
  );
}
