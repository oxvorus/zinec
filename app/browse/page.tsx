'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Search, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';
import type { Service } from '@/types';

const categories = [
  'Semua',
  'Essay Writing',
  'Tutoring',
  'Coding Help',
  'Research',
  'Presentation',
  'Translation',
  'Proofreading',
];

export default function BrowsePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            seller:sellers(
              *,
              user:users(*)
            )
          `)
          .eq('is_active', true);

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [supabase]);

  // Filter services
  useEffect(() => {
    let filtered = services;

    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">Jelajahi Layanan</h1>
          <p className="text-lg text-muted mb-8">
            Temukan asisten profesional untuk membantu tugas akademik Anda
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Cari layanan, penyedia, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 bg-white"
            />
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="card sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Filter</h3>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted uppercase">Kategori</p>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'text-muted hover:text-foreground hover:bg-muted/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Services Grid */}
            <main className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted">Loading services...</p>
                  </div>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-lg text-muted mb-4">Tidak ada layanan ditemukan</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                    }}
                    className="btn-primary"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredServices.map((service) => (
                    <Link
                      key={service.id}
                      href={`/service/${service.id}`}
                    >
                      <div className="card group cursor-pointer h-full hover:shadow-lg transition-all">
                        {/* Service Image */}
                        <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">📚</span>
                          </div>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                            {service.seller?.user?.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">
                              {service.seller?.user?.name}
                            </p>
                            <p className="text-xs text-muted">
                              {service.seller?.completion_rate || 100}% Completion
                            </p>
                          </div>
                        </div>

                        {/* Service Details */}
                        <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                          {service.title}
                        </h3>
                        
                        <p className="text-sm text-muted mb-4 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Rating & Category */}
                        <div className="flex items-center justify-between mb-4 text-xs">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-primary rounded-full font-semibold">
                            {service.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-foreground">
                              {service.rating.toFixed(1)}
                            </span>
                            <span className="text-muted">
                              ({service.reviews_count})
                            </span>
                          </div>
                        </div>

                        {/* Delivery & Price */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <Clock className="w-4 h-4" />
                            {service.delivery_days} hari
                          </div>
                          <p className="text-lg font-bold text-primary">
                            Rp{service.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
