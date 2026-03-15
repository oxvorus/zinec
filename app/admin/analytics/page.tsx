'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Activity, TrendingUp, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { LocationStatsCard } from '@/components/analytics/LocationStatsCard';
import { LocationHeatmap } from '@/components/analytics/LocationHeatmap';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface LocationSummary {
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
  last_activity: string;
}

interface AnalyticsOverview {
  total_visits: number;
  total_unique_visitors: number;
  total_orders: number;
  total_service_views: number;
  average_conversion_rate: number;
  top_province: string;
}

export default function AnalyticsDashboard() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState<LocationSummary[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedProvince]);

  async function fetchAnalytics() {
    try {
      setLoading(true);

      // Get date range
      const now = new Date();
      let startDate = new Date();
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'all':
          startDate = new Date('2000-01-01');
          break;
      }

      // Fetch from location_summary view
      let query = supabase
        .from('location_summary')
        .select('*')
        .order('total_visits', { ascending: false });

      if (selectedProvince) {
        query = query.eq('province', selectedProvince);
      }

      const { data, error } = await query;

      if (error) throw error;

      const summaryData = (data || []) as LocationSummary[];
      setStats(summaryData);

      // Calculate overview stats
      const overview: AnalyticsOverview = {
        total_visits: summaryData.reduce((sum, s) => sum + s.total_visits, 0),
        total_unique_visitors: summaryData.reduce((sum, s) => sum + s.unique_ips, 0),
        total_orders: summaryData.reduce((sum, s) => sum + s.total_orders, 0),
        total_service_views: summaryData.reduce((sum, s) => sum + s.service_views, 0),
        average_conversion_rate:
          summaryData.length > 0
            ? summaryData.reduce((sum, s) => sum + s.conversion_rate, 0) / summaryData.length
            : 0,
        top_province: summaryData[0]?.province || 'N/A',
      };

      setOverview(overview);
    } catch (error) {
      console.error('[Analytics] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const provinces = Array.from(new Set(stats.map(s => s.province)));

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Analytics Marketing</h1>
            <p className="text-sm text-zinc-600 mt-1">Data lokasi untuk optimasi iklan</p>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            Kembali ke Admin
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Date Range & Province Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {(['today', 'week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {range === 'today'
                  ? 'Hari Ini'
                  : range === 'week'
                    ? 'Minggu Ini'
                    : range === 'month'
                      ? 'Bulan Ini'
                      : 'Semua Waktu'}
              </button>
            ))}
          </div>

          <select
            value={selectedProvince || ''}
            onChange={(e) => setSelectedProvince(e.target.value || null)}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Semua Provinsi</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Overview Stats */}
        {overview && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Kunjungan</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {overview.total_visits.toLocaleString()}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Pengunjung Unik</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {overview.total_unique_visitors.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-cyan-600 opacity-20" />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Layanan Dilihat</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {overview.total_service_views.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Order</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {overview.total_orders}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600">Konversi Rata-rata</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900">
                    {overview.average_conversion_rate.toFixed(2)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Heatmap */}
        <div className="mb-8">
          <LocationHeatmap data={stats} />
        </div>

        {/* Detailed Stats by Location */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Statistik Terperinci per Lokasi
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600"></div>
                <p className="mt-2 text-zinc-600">Memuat data...</p>
              </div>
            </div>
          ) : stats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat, index) => (
                <LocationStatsCard
                  key={`${stat.province}-${stat.city}`}
                  stats={stat}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-zinc-300 mb-2" />
              <p className="text-zinc-500">Belum ada data lokasi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
