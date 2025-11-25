import React from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Seller {
  id: string;
  name: string;
  role: string;
  description: string;
  emoji: string;
  bgColor: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface User {
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}

export interface Order {
  id: string;
  clientName: string;
  title: string;
  deadline: Date;
  price: number;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  fileType: string;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'income' | 'withdrawal';
  description: string;
  status: 'success' | 'pending';
}