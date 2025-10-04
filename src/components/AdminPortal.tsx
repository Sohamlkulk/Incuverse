import { useState } from 'react';
import { Shield, LogOut, Star, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Review } from '../types';

export const AdminPortal = () => {
  const { user, logout } = useAuth();
  const { products, reviews, orders, toggleReviewVisibility, hasUserPurchasedProduct } = useData();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  const selectedReviews = selectedProductId ? getProductReviews(selectedProductId) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-950 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-300 font-medium">{user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
          <h2 className="text-3xl font-bold text-white mb-2">Product Management</h2>
          <p className="text-gray-400">Manage products and review moderation</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-400" />
              Products
            </h3>

            <div className="space-y-3">
              {products.map((product) => {
                const productReviews = getProductReviews(product.id);
                const avgRating =
                  productReviews.length > 0
                    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
                    : 0;

                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedProductId === product.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{product.name}</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <span>${product.price.toFixed(2)}</span>
                          <span>•</span>
                          <span>Stock: {product.stock}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{avgRating.toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span>{productReviews.length} reviews</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedProduct ? `Reviews: ${selectedProduct.name}` : 'Select a Product'}
            </h3>

            {!selectedProduct ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a product to view and manage reviews</p>
              </div>
            ) : selectedReviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No reviews for this product yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {selectedReviews.map((review: Review) => {
                  const hasPurchased = hasUserPurchasedProduct(review.userId, review.productId);

                  return (
                    <div
                      key={review.id}
                      className={`p-4 rounded-lg ${
                        review.isHidden ? 'bg-slate-700 opacity-60' : 'bg-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">
                              {review.userEmail}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-500'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            {!hasPurchased && (
                              <>
                                <span>•</span>
                                <span className="text-orange-400 font-medium">
                                  Not Purchased
                                </span>
                              </>
                            )}
                            {review.isHidden && (
                              <>
                                <span>•</span>
                                <span className="text-red-400 font-medium">Hidden</span>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleReviewVisibility(review.id)}
                          className={`p-2 rounded-lg transition ${
                            review.isHidden
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                          title={review.isHidden ? 'Show Review' : 'Hide Review'}
                        >
                          {review.isHidden ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <p className="text-gray-300">{review.comment}</p>

                      {!hasPurchased && (
                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <p className="text-sm text-orange-400 flex items-center gap-2">
                            <span className="font-semibold">Notice:</span>
                            This user has not purchased this product. Click the hide button above to hide this review from other users.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-slate-800 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Products</p>
              <p className="text-3xl font-bold text-white">{products.length}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-white">{reviews.length}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Hidden Reviews</p>
              <p className="text-3xl font-bold text-white">
                {reviews.filter((r) => r.isHidden).length}
              </p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-white">{orders.length}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
