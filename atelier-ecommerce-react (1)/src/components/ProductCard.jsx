import React from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFCFA } from '../services/kkiapay';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, isWishlisted, toggleWishlist } = useCart();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden hover:shadow-xl dark:hover:shadow-stone-950/50 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm ${
              product.badge.includes('%')
                ? 'bg-rose-500 text-white'
                : product.badge === 'Bestseller'
                ? 'bg-amber-500 text-white'
                : 'bg-stone-900 dark:bg-white text-white dark:text-stone-950'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-500 scale-110'
              : 'bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-stone-800 backdrop-blur-sm'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick action bar on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 py-2.5 px-3 bg-white/95 dark:bg-stone-800/95 hover:bg-white dark:hover:bg-stone-800 text-stone-900 dark:text-white text-xs font-semibold rounded-xl shadow-md backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye size={15} />
            <span>Aperçu</span>
          </button>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 py-2.5 px-3 bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 text-white dark:text-stone-950 text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag size={15} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Info container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rating and category */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
          <span className="uppercase tracking-wider text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold text-[11px]">{product.rating}</span>
            <span className="text-stone-400 dark:text-stone-500 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product title */}
        <h3
          onClick={() => onQuickView(product)}
          className="font-medium text-stone-900 dark:text-stone-100 hover:text-rose-700 dark:hover:text-rose-400 text-sm sm:text-base leading-snug cursor-pointer transition-colors mb-2 line-clamp-2"
        >
          {product.name}
        </h3>

        {/* Available colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {product.colors.map((c, idx) => (
              <span
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-700 shadow-inner"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[11px] text-stone-400 dark:text-stone-500 ml-1">
              {product.colors.length} coloris
            </span>
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-950 dark:text-white font-serif">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
              ≈ {formatFCFA(product.price)}
            </span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 underline underline-offset-4 transition-colors"
          >
            Détails
          </button>
        </div>
      </div>
    </div>
  );
};
