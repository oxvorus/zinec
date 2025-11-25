import React, { useState } from 'react';
import { Menu, X, GraduationCap, LayoutDashboard, LogIn, User as UserIcon, LogOut, ChevronDown, Briefcase } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'dashboard') => void;
  currentView: 'landing' | 'dashboard';
  onLoginClick: () => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, onLoginClick, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('landing')}
          >
            <GraduationCap className="w-8 h-8 text-zinec-600" />
            <span className="text-2xl font-display font-bold tracking-tight text-zinec-600">
              ZINEC
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
             <button 
              onClick={() => onNavigate('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentView === 'dashboard' 
                  ? 'text-zinec-600 bg-zinec-50' 
                  : 'text-gray-600 hover:text-zinec-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${user.role === 'seller' ? 'bg-purple-500' : 'bg-zinec-500'}`}>
                    {user.role === 'seller' ? <Briefcase className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user.role === 'seller' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-zinec-100 text-zinec-700'
                        }`}>
                          {user.role === 'seller' ? 'Assistant' : 'Mahasiswa'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-zinec-500 text-white hover:bg-zinec-600 transition-colors px-5 py-2 rounded-full font-semibold text-sm flex items-center gap-2 shadow-sm shadow-zinec-200"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-zinec-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <button
              onClick={() => {
                onNavigate('dashboard');
                setIsOpen(false);
              }}
              className="text-gray-600 hover:text-zinec-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Dashboard
            </button>
            {user ? (
              <button 
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full mt-2 bg-red-50 text-red-600 px-5 py-3 rounded-md font-bold text-center flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout ({user.name})
              </button>
            ) : (
              <button 
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="w-full mt-2 bg-zinec-500 text-white px-5 py-3 rounded-md font-bold text-center"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;