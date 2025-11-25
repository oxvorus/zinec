import React from 'react';
import { ArrowRight, UploadCloud, Clock, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onNavigateToDashboard: () => void;
  onLogin: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToDashboard, onLogin }) => {
  return (
    <div className="pt-24 pb-12 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Blue Container Slogan */}
      <div className="bg-[#40bbf7] rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-xl shadow-blue-200/50 mb-12 relative overflow-hidden animate-fade-in-up">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">
            Deadline Lewat??
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-yellow-300 mb-6 drop-shadow-md">
            100% Auto Refund di Zinec
          </h2>
          
          <p className="text-lg md:text-xl font-medium mb-2 opacity-90">
            Tugas jadi hambatan!?
          </p>
          <p className="text-xl md:text-2xl font-bold mb-4">
            TINGGAL KLIK UPLOAD TUGAS & ATUR DEADLINE SELESAI!!
          </p>
          <p className="text-sm md:text-base font-medium opacity-80 mb-8">
            Cuman di Zinec, solusi cepat buat kamu!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onNavigateToDashboard}
              className="bg-white text-zinec-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-5 h-5" />
              Ke Dashboard
            </button>
            <button 
              onClick={onLogin}
              className="bg-zinec-700/30 hover:bg-zinec-700/50 border border-white/30 text-white px-8 py-4 rounded-xl font-bold backdrop-blur-sm transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Login Member
            </button>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Terpercaya</h3>
            <p className="text-gray-500 text-sm">Ribuan mahasiswa telah terbantu.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Cepat & Tepat</h3>
            <p className="text-gray-500 text-sm">Deadline mepet? Kami siap bantu 24/7.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Mudah</h3>
            <p className="text-gray-500 text-sm">Cukup upload file, sisanya kami urus.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;