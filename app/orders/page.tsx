'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Loader2, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';
import type { Order } from '@/types';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-cyan-100 text-cyan-700',
  review: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
  pending: AlertCircle,
  accepted: Clock,
  in_progress: Clock,
  review: AlertCircle,
  completed: CheckCircle,
  cancelled: AlertCircle,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            service:services(title, category, price),
            buyer:users(name, email)
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [supabase]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === selectedStatus));
    }
  }, [orders, selectedStatus]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pesanan Saya</h1>
          <p className="text-muted">Kelola semua pesanan dan transaksi Anda</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted">Loading orders...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Status Filter */}
              <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'pending', label: 'Menunggu' },
                  { value: 'accepted', label: 'Diterima' },
                  { value: 'in_progress', label: 'Sedang Dikerjakan' },
                  { value: 'completed', label: 'Selesai' },
                  { value: 'cancelled', label: 'Dibatalkan' },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                      selectedStatus === status.value
                        ? 'bg-primary text-white'
                        : 'bg-muted/10 text-foreground hover:bg-muted/20'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-lg text-muted mb-4">Tidak ada pesanan</p>
                  <p className="text-sm text-muted mb-6">
                    {selectedStatus === 'all'
                      ? 'Anda belum memiliki pesanan. Mulai dengan menjelajahi layanan kami.'
                      : `Tidak ada pesanan dengan status "${selectedStatus}"`}
                  </p>
                  {selectedStatus === 'all' && (
                    <Link href="/browse" className="btn-primary">
                      Jelajahi Layanan
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                    const statusColor = statusColors[order.status as keyof typeof statusColors];
                    
                    return (
                      <Link key={order.id} href={`/order/${order.id}`}>
                        <div className="card group cursor-pointer hover:shadow-lg transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-foreground truncate">
                                  {order.service?.title || 'Unknown Service'}
                                </h3>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1 ${statusColor}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {order.status}
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted mb-3 line-clamp-1">
                                ID: {order.id.slice(0, 12)}...
                              </p>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                  <p className="text-muted font-medium">Kategori</p>
                                  <p className="text-foreground font-semibold">{order.service?.category}</p>
                                </div>
                                <div>
                                  <p className="text-muted font-medium">Harga</p>
                                  <p className="text-foreground font-semibold">
                                    Rp{order.price.toLocaleString('id-ID')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted font-medium">Deadline</p>
                                  <p className="text-foreground font-semibold">
                                    {new Date(order.deadline).toLocaleDateString('id-ID')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted font-medium">Dibuat</p>
                                  <p className="text-foreground font-semibold">
                                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <ChevronRight className="w-6 h-6 text-muted group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
