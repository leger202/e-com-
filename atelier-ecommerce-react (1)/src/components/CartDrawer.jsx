import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFCFA } from '../services/kkiapay';

export const CartDrawer = ({ onOpenCheckout }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    shippingFee,
    shippingThreshold,
    totalPrice
  } = useCart();

  if (!isCartOpen) return null;

  const amountUntilFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 transition-colors">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-stone-900 dark:text-white" />
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
                Votre Panier ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-full transition-colors"
              aria-label="Fermer le panier"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3.5 bg-rose-50/70 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/40">
            {amountUntilFreeShipping > 0 ? (
              <p className="text-xs text-rose-900 dark:text-rose-200 font-medium mb-2">
                Plus que <span className="font-bold">{amountUntilFreeShipping.toFixed(2)} €</span> pour profiter de la <span className="font-bold">Livraison Offerte</span> !
              </p>
            ) : (
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium mb-2 flex items-center gap-1.5">
                🎉 Félicitations ! La livraison vous est <span className="font-bold">offerte</span> !
              </p>
            )}
            <div className="w-full h-1.5 bg-rose-200/60 dark:bg-rose-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mb-6">
                  Découvrez nos nouvelles créations et trouvez votre prochaine pièce coup de cœur.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-950 text-xs font-semibold rounded-full shadow-sm transition-colors"
                >
                  Continuer le shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.itemKey}
                  className="flex gap-4 p-3 bg-stone-50/70 dark:bg-stone-800/60 rounded-2xl border border-stone-200/70 dark:border-stone-700/60"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-stone-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-700 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-xs sm:text-sm text-stone-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.itemKey)}
                          className="text-stone-400 hover:text-rose-500 p-1 -mt-1 -mr-1 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        <span>Taille : {item.selectedSize}</span>
                        <span>•</span>
                        <span>Coloris : {item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
                          className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs px-1 font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-stone-900 dark:text-white px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
                          className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs px-1 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-serif font-bold text-stone-950 dark:text-white block">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          ≈ {formatFCFA(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 space-y-3">
              {/* Promo code mockup */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Code avantage (ex: BIENVENUE10)"
                    className="w-full text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
                  />
                </div>
                <button className="px-4 py-2.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl transition-colors">
                  Appliquer
                </button>
              </div>

              {/* Subtotal & Shipping breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 pt-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison estimée</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Gratuite</span>
                    ) : (
                      `${shippingFee.toFixed(2)} €`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-base font-bold text-stone-950 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800 font-serif">
                  <span>Total TTC</span>
                  <div className="text-right">
                    <span>{totalPrice.toFixed(2)} €</span>
                    <span className="block text-xs font-sans text-rose-600 dark:text-rose-400 font-semibold">
                      ≈ {formatFCFA(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-4 bg-stone-950 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-950 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
              >
                <span>Commander maintenant (Kkiapay / CB)</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Paiement sécurisé Kkiapay (MoMo, Moov, Celtiis, CB)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
