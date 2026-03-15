'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';
import type { Order } from '@/types';

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'manual'>('stripe');
  const supabase = createClient();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            service:services(title, category, delivery_days),
            buyer:users(name, email),
            seller:sellers(
              user:users(name, email)
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setOrder(data as Order);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [params.id, supabase]);

  const handlePayment = async () => {
    if (!order) return;
    setIsProcessing(true);

    try {
      // In production, integrate with Stripe
      // For now, simulate payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update order status
      const { error } = await supabase
        .from('orders')
        .update({ status: 'accepted' })
        .eq('id', order.id);

      if (error) throw error;

      // Redirect to success
      setOrder({ ...order, status: 'accepted' });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Pembayaran gagal. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="card max-w-md text-center">
            <p className="text-lg text-muted mb-4">Pesanan tidak ditemukan</p>
            <Link href="/orders" className="btn-primary">
              Kembali ke Pesanan
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (order.status === 'accepted' || order.status === 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <div className="card text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Pembayaran Berhasil!</h1>
              <p className="text-muted mb-6">
                Pesanan Anda telah dikonfirmasi dan penyedia jasa akan segera mulai mengerjakan tugas Anda.
              </p>
              <Link href="/orders" className="btn-primary w-full">
                Lihat Pesanan Saya
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Review */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Ringkasan Pesanan</h2>
                <div className="space-y-4">
                  <div className="flex items-start justify-between pb-4 border-b border-border">
                    <div>
                      <p className="font-semibold text-foreground">{order.service?.title}</p>
                      <p className="text-sm text-muted">{order.service?.category}</p>
                    </div>
                    <p className="font-bold text-primary">Rp{order.price.toLocaleString('id-ID')}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted">Penyedia Jasa</p>
                      <p className="font-semibold text-foreground">{order.seller?.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted">Deadline</p>
                      <p className="font-semibold text-foreground">
                        {new Date(order.deadline).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pilih Metode Pembayaran
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      id: 'stripe',
                      name: 'Kartu Kredit (Stripe)',
                      description: 'Pembayaran aman dengan kartu kredit',
                      icon: '💳',
                    },
                    {
                      id: 'manual',
                      name: 'Transfer Manual',
                      description: 'Lakukan transfer manual ke rekening kami',
                      icon: '🏦',
                    },
                  ].map((method) => (
                    <label key={method.id} className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/5 transition-colors">
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'manual')}
                        className="w-4 h-4 mt-1 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{method.name}</p>
                        <p className="text-sm text-muted">{method.description}</p>
                      </div>
                      <span className="text-2xl">{method.icon}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="card">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="w-5 h-5 mt-1 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm text-muted">
                    Saya telah membaca dan setuju dengan{' '}
                    <Link href="/terms" className="text-primary hover:text-primary-dark font-semibold">
                      Syarat Layanan
                    </Link>
                    {' '}dan{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary-dark font-semibold">
                      Kebijakan Privasi
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="card sticky top-24 space-y-6">
                <div>
                  <p className="text-sm text-muted font-medium mb-4">RINGKASAN PESANAN</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-semibold text-foreground">Rp{order.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Fee Layanan</span>
                      <span className="font-semibold text-foreground">Rp{Math.round(order.price * 0.1).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        Rp{Math.round(order.price * 1.1).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Bayar Sekarang
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-muted">
                  Transaksi Anda dijamin aman. Pembayaran dienkripsi end-to-end.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
