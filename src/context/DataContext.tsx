import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Review, Order } from '../types';

interface DataContextType {
  products: Product[];
  cart: CartItem[];
  reviews: Review[];
  orders: Order[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addReview: (productId: string, userId: string, userEmail: string, rating: number, comment: string) => void;
  toggleReviewVisibility: (reviewId: string) => void;
  createOrder: (userId: string, items: { productId: string; quantity: number; price: number }[], total: number) => void;
  getProductById: (id: string) => Product | undefined;
  getReviewsForProduct: (productId: string) => Review[];
  hasUserPurchasedProduct: (userId: string, productId: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    imageUrl: 'https://images.pexels.com/photos/8000589/pexels-photo-8000589.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 50,
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor, GPS, and waterproof design.',
    price: 299.99,
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 30,
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    description: 'Durable anti-theft backpack with USB charging port and multiple compartments.',
    price: 59.99,
    imageUrl: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 100,
  },
];

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }

    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { productId, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const addReview = (
    productId: string,
    userId: string,
    userEmail: string,
    rating: number,
    comment: string
  ) => {
    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      userId,
      userEmail,
      rating,
      comment,
      isHidden: false,
      createdAt: new Date().toISOString(),
    };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const toggleReviewVisibility = (reviewId: string) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, isHidden: !review.isHidden } : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const createOrder = (
    userId: string,
    items: { productId: string; quantity: number; price: number }[],
    total: number
  ) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      userId,
      items,
      totalAmount: total,
      createdAt: new Date().toISOString(),
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getReviewsForProduct = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const hasUserPurchasedProduct = (userId: string, productId: string) => {
    return orders.some(
      (order) =>
        order.userId === userId &&
        order.items.some((item) => item.productId === productId)
    );
  };

  return (
    <DataContext.Provider
      value={{
        products,
        cart,
        reviews,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addReview,
        toggleReviewVisibility,
        createOrder,
        getProductById,
        getReviewsForProduct,
        hasUserPurchasedProduct,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
