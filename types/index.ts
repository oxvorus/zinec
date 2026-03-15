export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews_count: number;
  delivery_days: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  seller?: User;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  service_id: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  price: number;
  deadline: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  buyer?: User;
  seller?: User;
  service?: Service;
}

export interface Message {
  id: string;
  order_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  sender?: User;
}

export interface Transaction {
  id: string;
  seller_id: string;
  order_id?: string;
  type: 'income' | 'withdrawal' | 'fee';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Seller {
  id: string;
  user_id: string;
  bio?: string;
  response_time?: number;
  completion_rate?: number;
  total_earnings: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  services?: Service[];
}
