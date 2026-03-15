import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
                Z
              </div>
              <span className="font-bold text-foreground text-lg">Zinec</span>
            </div>
            <p className="text-sm text-muted mb-4">
              Platform terpercaya menghubungkan mahasiswa dengan asisten profesional untuk bantuan akademik.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Produk</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-muted hover:text-primary transition-colors">
                  Jelajahi Jasa
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted hover:text-primary transition-colors">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted hover:text-primary transition-colors">
                  Harga
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted hover:text-primary transition-colors">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm text-muted hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@zinec.id" className="hover:text-primary transition-colors">
                  support@zinec.id
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted">
                <Phone className="w-4 h-4" />
                <a href="tel:+6212345678" className="hover:text-primary transition-colors">
                  +62 (123) 456-78
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted">
            &copy; 2024 Zinec Digital. Semua hak dilindungi.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-sm text-muted hover:text-primary transition-colors">
              Syarat Layanan
            </Link>
            <Link href="/cookies" className="text-sm text-muted hover:text-primary transition-colors">
              Kebijakan Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
