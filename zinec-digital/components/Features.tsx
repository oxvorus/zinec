import React, { useState } from 'react';
import { Search, MoreVertical, Star } from 'lucide-react';
import { Seller, User } from '../types';

interface DashboardProps {
  onSellerClick: (seller: Seller) => void;
  user: User | null;
}

const sellers: Seller[] = [
  {
    id: '1',
    name: 'Rizky',
    role: 'IT Support',
    description: 'Install software & troubleshoot laptop',
    emoji: '👨‍💻',
    bgColor: 'bg-blue-50'
  },
  {
    id: '2',
    name: 'Dewi',
    role: 'Matematika',
    description: 'Tutor matematika all level',
    emoji: '👩‍🎓',
    bgColor: 'bg-purple-50'
  },
  {
    id: '3',
    name: 'Yoga',
    role: 'Ekonomi',
    description: 'Bantu hitungan laporan keuangan',
    emoji: '👨‍💼',
    bgColor: 'bg-orange-50'
  },
  {
    id: '4',
    name: 'Aldi',
    role: 'DKV',
    description: 'Bikin presentasi keren & infografis cepat',
    emoji: '🎨',
    bgColor: 'bg-pink-50'
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onSellerClick, user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 bg-slate-50 min-h-[600px]" id="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-display font-bold text-zinec-900">
            Personal Assistant
          </h2>
          <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
             Hai, {user ? <span className="text-zinec-600 font-bold">{user.name}</span> : 'Anonim'} 
             <MoreVertical className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-10 flex items-center">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input 
            type="text"
            placeholder="Cari nama, mata kuliah, atau jurusan..."
            className="w-full p-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Seller Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSellers.map((seller) => (
            <div 
              key={seller.id}
              onClick={() => onSellerClick(seller)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-xl ${seller.bgColor} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {seller.emoji}
              </div>
              
              <div className="mb-1">
                <h3 className="text-xl font-bold text-gray-900">{seller.name}</h3>
                <p className="text-sm font-semibold text-zinec-600">{seller.role}</p>
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-4 min-h-[40px]">
                {seller.description}
              </p>

              <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                 <Star className="w-4 h-4 fill-current" />
                 <span>5.0</span>
                 <span className="text-gray-300 font-normal ml-1">(100+ reviews)</span>
              </div>
            </div>
          ))}
        </div>

        {filteredSellers.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Penyedia jasa tidak ditemukan. Coba kata kunci lain.
          </div>
        )}

      </div>
    </section>
  );
};

export default Dashboard;