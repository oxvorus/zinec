'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LogOut, LayoutGrid, ShoppingBag, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@/types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
          setUser(userData as User);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
              Z
            </div>
            <span className="hidden font-bold text-foreground sm:inline-block">Zinec</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {user?.role === 'buyer' && (
              <>
                <Link href="/browse" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Jelajahi Jasa
                </Link>
                <Link href="/orders" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Pesanan Saya
                </Link>
              </>
            )}
            {user?.role === 'seller' && (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/services" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Layanan Saya
                </Link>
              </>
            )}
            {!user && (
              <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Masuk
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <button className="relative p-2 text-foreground hover:bg-muted/20 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                </button>
                <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-border">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted capitalize">{user.role === 'buyer' ? 'Pembeli' : 'Penjual'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-foreground hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
            {!user && !loading && (
              <Link href="/auth/login" className="hidden md:inline-block btn-primary">
                Masuk
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground hover:bg-muted/20 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-border py-4 space-y-3 md:hidden">
            {user?.role === 'buyer' && (
              <>
                <Link href="/browse" className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/20 rounded-lg transition-colors">
                  Jelajahi Jasa
                </Link>
                <Link href="/orders" className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/20 rounded-lg transition-colors">
                  Pesanan Saya
                </Link>
              </>
            )}
            {user?.role === 'seller' && (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/20 rounded-lg transition-colors">
                  Dashboard
                </Link>
                <Link href="/services" className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/20 rounded-lg transition-colors">
                  Layanan Saya
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
            {!user && !loading && (
              <Link href="/auth/login" className="block px-4 py-2 text-sm font-medium text-center btn-primary rounded-lg">
                Masuk
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
