import { useState } from 'react';
import { ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProductCard } from './ProductCard';
import { ProductDetails } from './ProductDetails';
import { Cart } from './Cart';
import { Product } from '../types';

export const UserShop = () => {
  const { user, logout } = useAuth();
  const { products, cart } = useData();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ShopHub</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">{user?.email}</span>
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>
      </main>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  );
};
