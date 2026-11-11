import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Sparkles, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../data/categories';

export const Navbar = ({ selectedCategory, onSelectCategory, searchQuery, setSearchQuery }) => {
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top announcement bar */}
      <div className="bg-stone-900 dark:bg-black text-stone-200 dark:text-stone-300 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-stone-800/40">
        <Sparkles size={13} className="text-amber-400" />
        <span>Livraison offerte dès 100€ d'achats • Retours garantis sous 30 jours</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <a href="#" className="flex flex-col items-center lg:items-start group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                ATELIER & CO
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400 font-semibold -mt-1">
                Paris • Maison de Mode
              </span>
            </a>
          </div>

          {/* Desktop Categories Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-stone-950 text-white dark:bg-white dark:text-stone-950 shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle, Search, Wishlist, Cart */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-stone-700 dark:text-stone-200 hover:text-amber-500 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
              title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              aria-label="Basculer le thème"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Search toggler / input */}
            <div className="relative">
              {showSearch ? (
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 w-44 sm:w-60 transition-all">
                  <Search size={16} className="text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 text-stone-700 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                  title="Rechercher un vêtement"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Wishlist counter */}
            <button
              onClick={() => {
                const el = document.getElementById('catalogue');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative p-2.5 text-stone-700 dark:text-stone-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors hidden sm:flex"
              title="Favoris"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-stone-950 text-white dark:bg-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-100 px-4 py-2 rounded-full font-medium text-sm transition-transform active:scale-95 shadow-sm"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Panier</span>
              {totalItems > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile categories sub-menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 py-3 space-y-1 animate-fadeIn">
            <div className="px-2 pb-2">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-3 py-2 text-sm focus:outline-none border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
