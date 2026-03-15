'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

const categories = [
  'Essay Writing',
  'Tutoring',
  'Coding Help',
  'Research',
  'Presentation',
  'Translation',
  'Proofreading',
  'Other',
];

export default function NewServicePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Essay Writing',
    price: '',
    delivery_days: '7',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Get seller profile
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!seller) {
        setError('Anda harus menjadi penjual untuk membuat layanan');
        setIsLoading(false);
        return;
      }

      // Create service
      const { data, error: insertError } = await supabase
        .from('services')
        .insert({
          seller_id: seller.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          delivery_days: parseInt(formData.delivery_days),
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push('/services');
    } catch (err: any) {
      setError(err.message || 'Gagal membuat layanan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buat Layanan Baru</h1>
          <p className="text-muted mb-8">Tuliskan detail tentang layanan yang ingin Anda tawarkan</p>

          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Judul Layanan
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Contoh: Jasa Menulis Essay Bahasa Inggris"
                  className="input-field w-full"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Deskripsi Layanan
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Jelaskan secara detail tentang layanan Anda, apa yang akan Anda lakukan, persyaratan, dll..."
                  rows={6}
                  className="input-field w-full resize-none"
                />
                <p className="text-xs text-muted mt-1">
                  {formData.description.length}/1000 karakter
                </p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="input-field w-full"
                />
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Waktu Pengerjaan (Hari)
                </label>
                <select
                  name="delivery_days"
                  value={formData.delivery_days}
                  onChange={handleChange}
                  className="input-field w-full"
                >
                  <option value="1">1 Hari</option>
                  <option value="3">3 Hari</option>
                  <option value="7">7 Hari</option>
                  <option value="14">14 Hari</option>
                  <option value="30">30 Hari</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 btn-outline"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Membuat...
                    </>
                  ) : (
                    'Buat Layanan'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-foreground mb-3">Tips untuk Layanan yang Sukses</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>✓ Gunakan judul yang jelas dan deskriptif</li>
              <li>✓ Jelaskan detail apa yang akan Anda berikan</li>
              <li>✓ Tetapkan harga yang kompetitif tapi menguntungkan</li>
              <li>✓ Pastikan waktu pengerjaan realistis</li>
              <li>✓ Respons cepat terhadap pertanyaan pembeli</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
