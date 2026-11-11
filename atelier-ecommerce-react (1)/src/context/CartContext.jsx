import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Load initial cart from localStorage
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('atelier_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Load wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Show temporary toast notification
  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'Standard';
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Unique';
    const itemKey = `${product.id}-${size}-${color}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            ...product,
            itemKey,
            selectedSize: size,
            selectedColor: color,
            quantity
          }
        ];
      }
    });

    triggerNotification(`"${product.name}" ajouté au panier`);
  };

  const removeFromCart = (itemKey) => {
    setItems((prevItems) => prevItems.filter((it) => it.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey, qty) => {
    if (qty <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((it) => (it.itemKey === itemKey ? { ...it, quantity: qty } : it))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        triggerNotification('Retiré des favoris');
        return prev.filter((id) => id !== productId);
      } else {
        triggerNotification('Ajouté à vos favoris ❤️');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingThreshold = 100;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 5.90;
  const totalPrice = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        shippingFee,
        shippingThreshold,
        totalPrice,
        wishlist,
        toggleWishlist,
        isWishlisted,
        notification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
