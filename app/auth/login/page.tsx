'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      // Redirect to home on success
      router.push('/');
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Masuk ke Zinec</h1>
          <p className="text-sm text-muted">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <span className="ml-2 text-muted">Ingat saya</span>
            </label>
            <Link href="/auth/forgot-password" className="text-primary hover:text-primary-dark font-semibold">
              Lupa password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sedang masuk...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-background text-muted font-medium">Atau</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full border border-border bg-white hover:bg-muted/5 text-foreground font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 active:bg-muted/10"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Masuk dengan Google
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6">
          Belum punya akun?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary-dark font-semibold">
            Daftar Sekarang
          </Link>
        </p>
      </div>

      {/* Login Type Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm">
        <p className="text-foreground font-semibold mb-2">Sudah Tahu?</p>
        <p className="text-muted mb-3">Anda dapat masuk sebagai pembeli atau penyedia jasa</p>
        <div className="flex gap-2 justify-center">
          <div className="text-xs bg-white px-3 py-1 rounded-full border border-blue-200 text-foreground">
            👤 Pembeli
          </div>
          <div className="text-xs bg-white px-3 py-1 rounded-full border border-blue-200 text-foreground">
            💼 Penyedia Jasa
          </div>
        </div>
      </div>
    </div>
  );
}
