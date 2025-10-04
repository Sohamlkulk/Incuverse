import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useData } from '../context/DataContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addToCart, getReviewsForProduct } = useData();

  const reviews = getReviewsForProduct(product.id).filter(r => !r.isHidden);
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 10 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(avgRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Details
            </button>
            <button
              onClick={() => addToCart(product.id)}
              disabled={product.stock === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
