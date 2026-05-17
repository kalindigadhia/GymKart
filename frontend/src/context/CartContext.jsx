import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await API.get('/cart');
      const count = res.data.data?.cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const updateCartCount = () => {
    fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};