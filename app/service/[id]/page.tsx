'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Star, Clock, User, MapPin, Award, ShoppingCart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Service } from '@/types';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(7);
  const [notes, setNotes] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadService = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            seller:sellers(
              *,
              user:users(id, name, email, avatar_url, bio)
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setService(data as Service);
      } catch (error) {
        console.error('Error loading service:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadService();
  }, [params.id, supabase]);

  const handleOrder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (!service) return;

      setIsOrdering(true);

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + selectedDelivery);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          deadline: deadline.toISOString(),
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();
      router.push(`/checkout/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-muted">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="card max-w-md text-center">
            <p className="text-lg text-muted mb-4">Layanan tidak ditemukan</p>
            <Link href="/browse" className="btn-primary">
              Kembali ke Browse
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Image */}
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden flex items-center justify-center">
                <span className="text-8xl">📚</span>
              </div>

              {/* Seller Info */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Tentang Penyedia Jasa</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0">
                    {service.seller?.user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-lg mb-1">
                      {service.seller?.user?.name}
                    </p>
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-muted">
                          {service.seller?.completion_rate || 100}% Completion
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-foreground">
                          {service.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted">{service.seller?.user?.bio || 'Profesional berpengalaman'}</p>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Deskripsi Layanan</h2>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>

              {/* Reviews */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Reviews ({service.reviews_count})
                </h2>
                <p className="text-muted text-center py-8">
                  Belum ada review untuk layanan ini
                </p>
              </div>
            </div>

            {/* Sidebar - Order Form */}
            <div>
              <div className="card sticky top-24 space-y-6">
                {/* Price */}
                <div>
                  <p className="text-sm text-muted font-medium mb-2">Harga</p>
                  <p className="text-4xl font-bold text-primary">
                    Rp{service.price.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Waktu Pengerjaan
                  </label>
                  <select
                    value={selectedDelivery}
                    onChange={(e) => setSelectedDelivery(Number(e.target.value))}
                    className="input-field w-full"
                  >
                    <option value={1}>1 Hari</option>
                    <option value={3}>3 Hari</option>
                    <option value={7}>7 Hari (Default)</option>
                    <option value={14}>14 Hari</option>
                  </select>
                  <p className="text-xs text-muted mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Estimasi selesai: {new Date(Date.now() + selectedDelivery * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')}
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Berikan detail tambahan tentang pesanan Anda..."
                    className="input-field w-full h-24 resize-none"
                  />
                </div>

                {/* Service Info */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Kategori</span>
                    <span className="font-semibold text-foreground">{service.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{service.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <button
                    onClick={handleOrder}
                    disabled={isOrdering}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isOrdering ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Pesan Sekarang
                      </>
                    )}
                  </button>
                  <button className="btn-outline w-full">
                    Hubungi Penyedia
                  </button>
                </div>

                {/* Guarantee */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-center text-green-700">
                  ✓ Transaksi Aman & Terjamin
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
