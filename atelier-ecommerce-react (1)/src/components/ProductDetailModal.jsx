import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFCFA } from '../services/kkiapay';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart, isWishlisted, toggleWishlist } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-stone-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative bg-stone-100 dark:bg-stone-800/80 p-6 sm:p-8 flex items-center justify-center">
            <div className="aspect-[4/5] w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-stone-200/60 dark:border-stone-700/60">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {product.badge && (
              <span className="absolute top-8 left-8 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-stone-900 dark:bg-white text-white dark:text-stone-950 rounded-full shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                <span className="uppercase tracking-widest font-bold text-rose-600 dark:text-rose-400">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span className="font-bold text-stone-900 dark:text-stone-100">{product.rating}</span>
                  <span className="text-stone-400 dark:text-stone-500">({product.reviewsCount} avis)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white leading-tight mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold font-serif text-stone-950 dark:text-white">
                  {product.price.toFixed(2)} €
                </span>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  (≈ {formatFCFA(product.price)})
                </span>
                {product.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
                {product.inStock ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    En stock
                  </span>
                ) : (
                  <span className="ml-auto text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full">
                    Épuisé
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">Couleur</span>
                    <span className="text-stone-500 dark:text-stone-400 font-medium">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative p-1 rounded-full transition-all ${
                          selectedColor === c.name
                            ? 'ring-2 ring-stone-900 dark:ring-white ring-offset-2 dark:ring-offset-stone-900'
                            : 'hover:opacity-80'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-stone-300 dark:border-stone-700 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">Taille</span>
                    <span className="text-stone-400 underline cursor-pointer hover:text-stone-700 dark:hover:text-stone-200">Guide des tailles</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[42px] h-10 px-3 text-xs font-semibold rounded-xl border transition-all ${
                          selectedSize === s
                            ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white shadow-sm'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bullet Details */}
              {product.details && (
                <div className="border-t border-stone-100 dark:border-stone-800 pt-4 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                    Caractéristiques & Matières
                  </h4>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 list-disc list-inside">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions: Quantity & Add to cart */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-6 mt-4">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-2xl bg-stone-50 dark:bg-stone-800 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-stone-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : product.inStock
                      ? 'bg-stone-950 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed dark:bg-stone-800 dark:text-stone-600'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check size={18} />
                      <span>Ajouté avec succès !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Ajouter au panier • {(product.price * quantity).toFixed(2)} €</span>
                    </>
                  )}
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-2xl border transition-colors ${
                    wishlisted
                      ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-500'
                      : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-rose-500 hover:border-rose-200'
                  }`}
                  aria-label="Favoris"
                >
                  <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Guarantees mini banner */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-stone-400" />
                  Expédié sous 24h
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-stone-400" />
                  Échange gratuit
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-stone-400" />
                  Paiement sécurisé Kkiapay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
