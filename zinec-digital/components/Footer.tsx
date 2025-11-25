import React from 'react';
import { GraduationCap, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
               <GraduationCap className="w-8 h-8 text-zinec-600" />
              <span className="text-xl font-display font-bold text-zinec-600">ZINEC</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Solusi tugas kuliah cepat, aman, dan terpercaya. Hemat waktumu untuk hal yang lebih penting.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Joki Tugas</a></li>
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Skripsi & Thesis</a></li>
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Desain Grafis</a></li>
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Konsultasi</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Karir</a></li>
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-zinec-500 transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Sosial Media</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-zinec-500 hover:bg-zinec-50 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-zinec-500 hover:bg-zinec-50 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-zinec-500 hover:bg-zinec-50 transition-all">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2024 Zinec Digital. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500 text-xs">
            <a href="#" className="hover:text-zinec-600">Privacy Policy</a>
            <a href="#" className="hover:text-zinec-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;