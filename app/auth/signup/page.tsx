'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle, Eye, EyeOff, Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with Supabase
      const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (!authUser) {
        setError('Gagal membuat akun');
        setIsLoading(false);
        return;
      }

      // Create user profile
      const { error: insertError } = await supabase.from('users').insert({
        id: authUser.id,
        email,
        name,
        role,
      });

      if (insertError) {
        setError('Gagal membuat profil pengguna');
        setIsLoading(false);
        return;
      }

      // If seller, create seller profile
      if (role === 'seller') {
        const { error: sellerError } = await supabase.from('sellers').insert({
          user_id: authUser.id,
        });

        if (sellerError) {
          console.error('Seller profile creation error:', sellerError);
        }
      }

      // Redirect to login or home
      router.push('/auth/login?signup=success');
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg mx-auto mb-4">
            Z
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Daftar ke Zinec</h1>
          <p className="text-sm text-muted">
            Buat akun baru untuk memulai
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6 p-1 bg-muted/10 rounded-lg flex gap-1">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              role === 'buyer'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Pembeli
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              role === 'seller'
                ? 'bg-white text-secondary shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Penyedia Jasa
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10"
                placeholder="Nama lengkap Anda"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="contoh@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start cursor-pointer text-xs">
            <input
              type="checkbox"
              required
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20 mt-0.5"
            />
            <span className="ml-2 text-muted">
              Saya setuju dengan{' '}
              <Link href="/terms" className="text-primary hover:text-primary-dark font-semibold">
                Syarat Layanan
              </Link>{' '}
              dan{' '}
              <Link href="/privacy" className="text-primary hover:text-primary-dark font-semibold">
                Kebijakan Privasi
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sedang daftar...
              </>
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-dark font-semibold">
            Masuk di sini
          </Link>
        </p>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-center">
        <p className="text-foreground font-semibold mb-2">Informasi Penting</p>
        <p className="text-muted mb-2">
          Sebagai{' '}
          <span className="font-semibold text-foreground">
            {role === 'buyer' ? 'Pembeli' : 'Penyedia Jasa'}
          </span>
          , Anda dapat {role === 'buyer' ? 'memesan jasa' : 'menawarkan layanan'} di platform ini.
        </p>
        <button
          type="button"
          onClick={() => setRole(role === 'buyer' ? 'seller' : 'buyer')}
          className="text-primary hover:text-primary-dark font-semibold underline"
        >
          Ubah peran
        </button>
      </div>
    </div>
  );
}
