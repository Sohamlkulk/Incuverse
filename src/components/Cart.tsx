import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface CartProps {
  onClose: () => void;
}

export const Cart = ({ onClose }: CartProps) => {
  const { user } = useAuth();
  const { cart, products, updateCartQuantity, removeFromCart, clearCart, createOrder } = useData();

  const cartItems = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId)!,
  }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (user && cart.length > 0) {
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));
      createOrder(user.id, orderItems, total);
      clearCart();
      alert('Order placed successfully!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 bg-gray-50 rounded-xl p-4"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-blue-600 font-bold mb-3">
                        ${item.product.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                            className="p-2 hover:bg-gray-100 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                Math.min(item.product.stock, item.quantity + 1)
                              )
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 hover:bg-gray-100 transition disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-semibold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition"
                >
                  Checkout
                </button>

                <button
                  onClick={onClose}
                  className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
