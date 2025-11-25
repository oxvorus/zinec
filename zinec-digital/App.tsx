import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Features'; 
import SellerDashboard from './components/SellerDashboard';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { X, LogIn, Mail, Lock, Loader2, AlertCircle, User as UserIcon, Briefcase } from 'lucide-react';
import { Seller, User } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginRole, setLoginRole] = useState<'buyer' | 'seller'>('buyer');

  const handleSellerClick = (seller: Seller) => {
    if (user) {
      // If already logged in, proceed
      alert(`Membuka form pemesanan untuk ${seller.name}`);
    } else {
      setSelectedSeller(seller);
      setShowLoginModal(true);
    }
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    setSelectedSeller(null);
    setEmail('');
    setPassword('');
    setError('');
    setLoginRole('buyer'); // Reset role to default
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      if (email && password.length >= 6) {
        setUser({
          name: email.split('@')[0], // Use part of email as name
          email: email,
          role: loginRole
        });
        setIsLoading(false);
        handleLoginClose();
        
        // If login as seller, force redirect to dashboard
        // Fix: Cast to string to avoid TS error about no overlap if type inference is too strict
        if ((loginRole as string) === 'seller') {
          setCurrentView('dashboard');
        } else if (selectedSeller) {
           // User logged in after clicking a seller
           alert(`Login berhasil sebagai ${loginRole === 'seller' ? 'Assistant' : 'Mahasiswa'}! Melanjutkan ke jasa ${selectedSeller.name}`);
        }
      } else {
        setError('Email atau password salah. (Password min 6 karakter)');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        name: 'Google User',
        email: 'user@gmail.com',
        role: loginRole
      });
      setIsLoading(false);
      handleLoginClose();
      
      // Fix: Cast to string to avoid TS error about no overlap if type inference is too strict
      if ((loginRole as string) === 'seller') {
        setCurrentView('dashboard');
      } else if (selectedSeller) {
           alert(`Login Google berhasil sebagai ${loginRole === 'seller' ? 'Assistant' : 'Mahasiswa'}! Melanjutkan ke jasa ${selectedSeller.name}`);
      }
    }, 1500);
  };

  // Determine what to render based on View and User Role
  const renderContent = () => {
    // If logged in as Seller and viewing dashboard, show Seller Dashboard
    if (currentView === 'dashboard' && user?.role === 'seller') {
      return <SellerDashboard user={user} />;
    }

    // Standard Buyer Views
    if (currentView === 'landing') {
      return (
        <>
          <Hero 
            onNavigateToDashboard={() => setCurrentView('dashboard')} 
            onLogin={() => setShowLoginModal(true)}
          />
          <Dashboard onSellerClick={handleSellerClick} user={user} />
        </>
      );
    }

    // Buyer Dashboard (Listing)
    return (
      <div className="pt-16">
        <Dashboard onSellerClick={handleSellerClick} user={user} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-zinec-200 selection:text-zinec-900">
      <Navbar 
        onNavigate={setCurrentView} 
        currentView={currentView}
        onLoginClick={() => setShowLoginModal(true)}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="relative">
        {renderContent()}
      </main>

      <Footer />
      <ChatWidget />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleLoginClose} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-2 text-center relative">
              <button 
                onClick={handleLoginClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-zinec-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinec-600 shadow-sm">
                <LogIn className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedSeller ? `Order Jasa ${selectedSeller.name}` : 'Selamat Datang Kembali'}
              </h3>
              <p className="text-gray-500 text-sm">
                Silahkan pilih peran anda untuk melanjutkan.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 pt-4 overflow-y-auto">
              
              {/* Role Selection */}
              <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                <button
                  type="button"
                  onClick={() => setLoginRole('buyer')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginRole === 'buyer' ? 'bg-white shadow-sm text-zinec-600' : 'text-gray-500 hover:text-gray-600'}`}
                >
                  <UserIcon className="w-4 h-4" />
                  Mahasiswa
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('seller')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginRole === 'seller' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-600'}`}
                >
                  <Briefcase className="w-4 h-4" />
                  Assistant
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-zinec-500 focus:ring-2 focus:ring-zinec-200 outline-none transition-all text-sm"
                      placeholder="contoh@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-zinec-500 focus:ring-2 focus:ring-zinec-200 outline-none transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-zinec-600 focus:ring-zinec-500 w-4 h-4" />
                    <span className="ml-2 text-gray-600">Ingat saya</span>
                  </label>
                  <a href="#" className="text-zinec-600 hover:text-zinec-700 font-semibold">Lupa password?</a>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                    loginRole === 'seller' 
                      ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' 
                      : 'bg-zinec-500 hover:bg-zinec-600 shadow-zinec-500/30'
                  }`}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (loginRole === 'seller' ? 'Masuk sebagai Assistant' : 'Masuk sebagai Mahasiswa')}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-400 font-medium">Atau masuk dengan</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 active:bg-gray-100 disabled:opacity-70"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Google Account
              </button>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
              Belum punya akun? <a href="#" className="text-zinec-600 font-bold hover:underline">Daftar Sekarang</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;