import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductList } from './components/ProductList';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { PRODUCTS } from './data/products';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const [products] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { notification } = useCart();

  const scrollToCatalogue = () => {
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 dark:bg-white text-white dark:text-stone-950 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce border border-stone-700 dark:border-stone-200">
          <Sparkles size={16} className="text-amber-400 dark:text-amber-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Banner */}
      <HeroBanner onShopNowClick={scrollToCatalogue} />

      {/* Product List */}
      <main className="flex-1">
        <ProductList
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  );
}
