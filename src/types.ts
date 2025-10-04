export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  createdAt: string;
}
