'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Zap, Users, Award, TrendingUp, CheckCircle, ArrowRight, Star, BookOpen, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-blue-50 via-background to-background" />
        
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-primary font-semibold text-sm">
                  Solusi Akademik Terpercaya
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Platform Jasa Akademik <span className="text-primary">Terpercaya</span>
              </h1>
              
              <p className="text-xl text-muted mb-8 leading-relaxed">
                Temukan asisten profesional untuk membantu tugas akademik Anda. Dari essay hingga tutoring, kami menghubungkan Anda dengan ahli terbaik.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup" className="btn-primary text-center">
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <Link href="/browse" className="btn-outline text-center">
                  Jelajahi Jasa
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">10K+</p>
                  <p className="text-sm text-muted">Pengguna Aktif</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted">Penyedia Jasa</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">4.8★</p>
                  <p className="text-sm text-muted">Rating Rata-rata</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="animate-slide-in-right hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-border">
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-border shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-primary">
                          {i === 1 ? <BookOpen className="w-6 h-6" /> : i === 2 ? <Briefcase className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {i === 1 ? 'Essay Writing' : i === 2 ? 'Tutoring Service' : 'Expert Review'}
                          </p>
                          <p className="text-xs text-muted">Layanan profesional terbaik</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Cara Kerjanya</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Proses yang sederhana untuk mendapatkan bantuan akademik berkualitas tinggi
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Lihat Layanan',
                description: 'Jelajahi berbagai layanan akademik dari penyedia terpercaya',
                icon: BookOpen,
              },
              {
                step: '2',
                title: 'Pilih & Pesan',
                description: 'Pilih layanan dan buat pesanan dengan detail kebutuhan Anda',
                icon: CheckCircle,
              },
              {
                step: '3',
                title: 'Komunikasi',
                description: 'Berkomunikasi langsung dengan asisten melalui chat terintegrasi',
                icon: Users,
              },
              {
                step: '4',
                title: 'Selesai & Review',
                description: 'Terima hasil dan berikan review untuk pengalaman terbaik',
                icon: Star,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/4 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                  <div className="card text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-primary font-bold text-sm mb-3">
                      Langkah {item.step}
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Fitur Unggulan</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk pengalaman akademik yang lebih baik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Respons Cepat',
                description: 'Tim profesional siap membantu Anda dengan respons cepat dan solusi terbaik',
              },
              {
                icon: Award,
                title: 'Verifikasi Ahli',
                description: 'Semua penyedia jasa telah diverifikasi dan memiliki pengalaman terbukti',
              },
              {
                icon: TrendingUp,
                title: 'Transparansi Harga',
                description: 'Harga yang jelas tanpa biaya tersembunyi, Anda tahu apa yang dibayarkan',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Testimoni Pengguna</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Lihat apa yang dikatakan pengguna kami tentang pengalaman mereka
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Adi Pratama',
                role: 'Mahasiswa UI',
                content: 'Layanan ini sangat membantu saya menyelesaikan tugas akademik tepat waktu dengan kualitas terbaik.',
                rating: 5,
              },
              {
                name: 'Siti Nurhaliza',
                role: 'Guru Bahasa Inggris',
                content: 'Platform yang mudah digunakan dan memiliki tim profesional yang terpercaya untuk membantu siswa.',
                rating: 5,
              },
              {
                name: 'Budi Santoso',
                role: 'Mahasiswa ITB',
                content: 'Asisten yang saya dapatkan sangat berpengalaman dan memberikan hasil yang memuaskan.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Siap untuk Memulai?
              </h2>
              <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan mahasiswa yang telah mempercayai Zinec Digital untuk bantuan akademik mereka
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-primary font-bold hover:bg-blue-50 transition-colors">
                  Daftar Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/browse" className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-bold hover:bg-white/10 transition-colors">
                  Lihat Layanan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
