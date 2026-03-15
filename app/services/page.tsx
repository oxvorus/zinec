'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Loader2, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';
import type { Service } from '@/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: seller } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!seller) return;

        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('seller_id', seller.id)
          .order('created_at', { ascending: false });

        setServices(data || []);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setServices(services.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Gagal menghapus layanan');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Layanan Saya</h1>
              <p className="text-muted">Kelola semua layanan yang Anda tawarkan</p>
            </div>
            <Link href="/services/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Tambah Layanan
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted">Loading services...</p>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-lg text-muted mb-4">Belum ada layanan</p>
              <p className="text-sm text-muted mb-6">
                Mulai dengan membuat layanan pertama Anda untuk menarik pembeli potensial.
              </p>
              <Link href="/services/new" className="btn-primary">
                Buat Layanan Pertama
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="card group hover:shadow-lg transition-all">
                  {/* Service Image */}
                  <div className="relative w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                    <span className="text-5xl">📚</span>
                  </div>

                  {/* Service Details */}
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{service.title}</h3>
                  
                  <p className="text-sm text-muted mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Category & Price */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-primary rounded-full">
                      {service.category}
                    </span>
                    <p className="font-bold text-primary">
                      Rp{service.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="text-center p-2 bg-muted/10 rounded-lg">
                      <p className="text-muted">Rating</p>
                      <p className="font-bold text-foreground">{service.rating.toFixed(1)}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/10 rounded-lg">
                      <p className="text-muted">Reviews</p>
                      <p className="font-bold text-foreground">{service.reviews_count}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/service/${service.id}`}
                      className="flex-1 btn-outline text-sm justify-center flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat
                    </Link>
                    <Link
                      href={`/services/${service.id}/edit`}
                      className="flex-1 btn-outline text-sm justify-center flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="flex-1 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
