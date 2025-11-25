import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CheckCircle, 
  Wallet, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  MoreHorizontal,
  Download,
  Upload,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import { User, Order, Transaction } from '../types';

interface SellerDashboardProps {
  user: User;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    clientName: 'Budi Santoso',
    title: 'Analisis Statistik Bab 4 Skripsi',
    deadline: new Date(Date.now() + 86400000 * 2), // 2 days from now
    price: 250000,
    status: 'in_progress',
    fileType: 'DOCX'
  },
  {
    id: 'ORD-002',
    clientName: 'Siti Aminah',
    title: 'Presentasi PPT Sejarah Desain',
    deadline: new Date(Date.now() + 86400000 * 1), // 1 day from now
    price: 75000,
    status: 'pending',
    fileType: 'PPTX'
  },
  {
    id: 'ORD-003',
    clientName: 'Kevin Wijaya',
    title: 'Joki Coding React Native',
    deadline: new Date(Date.now() - 86400000 * 1), // Yesterday
    price: 500000,
    status: 'review',
    fileType: 'ZIP'
  },
  {
    id: 'ORD-004',
    clientName: 'Rina Nose',
    title: 'Makalah Ekonomi Makro',
    deadline: new Date(Date.now() - 86400000 * 5),
    price: 150000,
    status: 'completed',
    fileType: 'PDF'
  }
];

const mockTransactions: Transaction[] = [
  { id: 'TRX-1', date: new Date(), amount: 150000, type: 'income', description: 'Order #ORD-004 Completed', status: 'success' },
  { id: 'TRX-2', date: new Date(Date.now() - 86400000), amount: 500000, type: 'withdrawal', description: 'Withdrawal to BCA', status: 'success' },
  { id: 'TRX-3', date: new Date(Date.now() - 86400000 * 2), amount: 300000, type: 'income', description: 'Order #ORD-009 Completed', status: 'success' },
];

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'finance'>('overview');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'review': return 'Review Client';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard Assistant</h1>
            <p className="text-slate-500 text-sm mt-1">Selamat bekerja kembali, <span className="font-semibold text-purple-600">{user.name}</span>! 👋</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 shadow-md shadow-purple-200">
              + Buat Penawaran Custom
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'overview' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Ringkasan
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'orders' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <ShoppingBag className="w-4 h-4" /> Kelola Order
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'finance' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Wallet className="w-4 h-4" /> Keuangan
          </button>
        </div>

        {/* Stats Row (Always visible or just on Overview) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-16 h-16 text-purple-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Pendapatan</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(4500000)}</h3>
              <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> +12.5% dari bulan lalu
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShoppingBag className="w-16 h-16 text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Order Aktif</p>
              <h3 className="text-2xl font-bold text-slate-900">3</h3>
              <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
                2 Deadline &lt; 24 Jam
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Order Selesai</p>
              <h3 className="text-2xl font-bold text-slate-900">124</h3>
              <div className="mt-4 flex items-center text-xs text-gray-500 font-medium">
                Total seumur hidup
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-16 h-16 text-orange-500" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">Performa Toko</p>
              <h3 className="text-2xl font-bold text-slate-900">4.9 <span className="text-sm text-gray-400 font-normal">/ 5.0</span></h3>
              <div className="mt-4 flex items-center text-xs text-orange-600 font-medium">
                Level: Super Assistant
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column (Orders) */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
            
            {/* Active Orders Section */}
            {(activeTab === 'overview' || activeTab === 'orders') && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Order Berlangsung
                  </h3>
                  <button className="text-sm text-purple-600 font-medium hover:underline">Lihat Semua</button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {mockOrders.filter(o => o.status !== 'completed').map((order) => (
                    <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-wide`}>
                              {getStatusLabel(order.status)}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">{order.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg">{order.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">Client: <span className="font-medium text-slate-700">{order.clientName}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{formatCurrency(order.price)}</p>
                          <p className="text-xs text-gray-400 mt-1">{order.fileType} File</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span>Deadline: </span>
                          <span className={`font-bold ${order.deadline.getTime() < Date.now() + 86400000 ? 'text-red-600' : 'text-gray-800'}`}>
                            {order.deadline.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                            Chat Client
                          </button>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 shadow-sm">
                            Upload Hasil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {mockOrders.filter(o => o.status !== 'completed').length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      Tidak ada order yang sedang aktif.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completed Orders / History */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Riwayat Order Selesai
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                   {mockOrders.filter(o => o.status === 'completed').map((order) => (
                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{order.title}</h4>
                          <p className="text-xs text-gray-500">Selesai pada: {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-gray-900">{formatCurrency(order.price)}</p>
                         <div className="flex text-yellow-400 text-xs mt-1">★★★★★</div>
                      </div>
                    </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Finance & Quick Actions) */}
          <div className="space-y-8 animate-fade-in-up delay-75">
            
            {/* Wallet Card */}
            {(activeTab === 'overview' || activeTab === 'finance') && (
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <DollarSign className="w-24 h-24" />
                </div>
                
                <p className="text-purple-200 text-sm font-medium mb-2">Saldo Dompet Assistant</p>
                <h2 className="text-4xl font-bold mb-6 tracking-tight">Rp 1.250.000</h2>
                
                <div className="flex gap-3 relative z-10">
                  <button className="flex-1 bg-white text-purple-900 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                    <ArrowUpRight className="w-4 h-4" /> Tarik Dana
                  </button>
                  <button className="flex-1 bg-purple-800/50 backdrop-blur-sm border border-white/20 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-purple-800 transition-colors">
                    Detail
                  </button>
                </div>
              </div>
            )}

            {/* Financial Chart Placeholder */}
            {activeTab === 'finance' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Statistik Keuangan</h3>
                <div className="h-40 flex items-end justify-between gap-2 px-2">
                  {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-purple-100 rounded-t-sm relative group cursor-pointer hover:bg-purple-200 transition-colors" style={{ height: `${h}%` }}>
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                          {h * 10}k
                       </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Sen</span>
                  <span>Sel</span>
                  <span>Rab</span>
                  <span>Kam</span>
                  <span>Jum</span>
                  <span>Sab</span>
                  <span>Min</span>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {(activeTab === 'overview' || activeTab === 'finance') && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 text-sm">Transaksi Terakhir</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {mockTransactions.map((trx) => (
                    <div key={trx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${trx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {trx.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 line-clamp-1">{trx.description}</p>
                          <p className="text-[10px] text-gray-400">{trx.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                        {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Hints */}
            {activeTab === 'overview' && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Tingkatkan Performamu!</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      Respon chat di bawah 15 menit untuk mendapatkan badge "Fast Response" dan menaikkan ranking pencarian.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;