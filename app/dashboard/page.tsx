'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Plus, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';
import type { Order, Transaction } from '@/types';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalServices: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get seller profile
        const { data: seller } = await supabase
          .from('sellers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!seller) return;

        // Load orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('seller_id', seller.id);

        // Load transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('seller_id', seller.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Load services
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .eq('seller_id', seller.id);

        setOrders(ordersData || []);
        setTransactions(transactionsData || []);

        // Calculate stats
        const activeCount = ordersData?.filter(
          (o) => ['pending', 'accepted', 'in_progress'].includes(o.status)
        ).length || 0;
        
        const completedCount = ordersData?.filter(
          (o) => o.status === 'completed'
        ).length || 0;

        setStats({
          totalEarnings: seller.total_earnings,
          activeOrders: activeCount,
          completedOrders: completedCount,
          totalServices: servicesData?.length || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Penjual</h1>
              <p className="text-muted">Kelola layanan dan pesanan Anda</p>
            </div>
            <Link href="/dashboard/services/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Tambah Layanan
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-primary animate-spin mx-auto mb-4" />
                <p className="text-muted">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {[
                  {
                    label: 'Total Earnings',
                    value: `Rp${stats.totalEarnings.toLocaleString('id-ID')}`,
                    icon: DollarSign,
                    color: 'blue',
                  },
                  {
                    label: 'Active Orders',
                    value: stats.activeOrders,
                    icon: Clock,
                    color: 'orange',
                  },
                  {
                    label: 'Completed Orders',
                    value: stats.completedOrders,
                    icon: CheckCircle,
                    color: 'green',
                  },
                  {
                    label: 'Services',
                    value: stats.totalServices,
                    icon: TrendingUp,
                    color: 'purple',
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  const colorMap = {
                    blue: 'bg-blue-100 text-blue-600',
                    orange: 'bg-orange-100 text-orange-600',
                    green: 'bg-green-100 text-green-600',
                    purple: 'bg-purple-100 text-purple-600',
                  };
                  return (
                    <div key={index} className="card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted font-medium mb-2">{stat.label}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${colorMap[stat.color as keyof typeof colorMap]}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Pesanan Terbaru
                    </h2>

                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted mb-4">Belum ada pesanan</p>
                        <p className="text-sm text-muted">Pesanan akan muncul di sini ketika ada yang melakukan pemesanan</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <Link key={order.id} href={`/orders/${order.id}`}>
                            <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/5 transition-colors cursor-pointer">
                              <div className="flex-1">
                                <p className="font-semibold text-foreground mb-1">
                                  Order #{order.id.slice(0, 8)}
                                </p>
                                <p className="text-sm text-muted">
                                  Deadline: {new Date(order.deadline).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary mb-1">
                                  Rp{order.price.toLocaleString('id-ID')}
                                </p>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : order.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {orders.length > 5 && (
                      <Link href="/orders" className="block mt-4 btn-outline text-center">
                        Lihat Semua Pesanan
                      </Link>
                    )}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <div className="card">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Transaksi Terbaru
                    </h2>

                    {transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted">Belum ada transaksi</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.slice(0, 5).map((transaction) => (
                          <div key={transaction.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground capitalize">
                                {transaction.type}
                              </p>
                              <p className="text-xs text-muted">
                                {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                            <p className={`font-bold text-sm ${
                              transaction.type === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}Rp{transaction.amount.toLocaleString('id-ID')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <Link href="/services" className="card hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Kelola Layanan</h3>
                      <p className="text-sm text-muted">Lihat dan edit layanan yang Anda tawarkan</p>
                    </div>
                  </div>
                </Link>
                <Link href="/orders" className="card hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Lihat Semua Pesanan</h3>
                      <p className="text-sm text-muted">Kelola semua pesanan masuk dari pembeli</p>
                    </div>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
