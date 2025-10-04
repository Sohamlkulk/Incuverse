import { useState } from 'react';
import { X, Star, ShoppingCart } from 'lucide-react';
import { Product, Review } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetails = ({ product, onClose }: ProductDetailsProps) => {
  const { user } = useAuth();
  const { addToCart, getReviewsForProduct, addReview } = useData();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const reviews = getReviewsForProduct(product.id).filter(r => !r.isHidden);
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const hasReviewed = reviews.some(r => r.userId === user?.id);

  const handleSubmitReview = () => {
    if (user && comment.trim()) {
      addReview(product.id, user.id, user.email, rating, comment);
      setComment('');
      setRating(5);
      setShowReviewForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>

            <div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {avgRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <span className="text-gray-600">
                  Stock: <span className="font-semibold">{product.stock} units</span>
                </span>
              </div>

              <button
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
              {!hasReviewed && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Write Your Review</h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReview}
                    disabled={!comment.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewForm(false);
                      setComment('');
                      setRating(5);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                reviews.map((review: Review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {review.userEmail}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
