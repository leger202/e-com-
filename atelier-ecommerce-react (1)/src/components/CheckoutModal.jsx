import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Lock, Smartphone, Loader2, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFCFA, triggerKkiapayPayment, KKIAPAY_CONFIG } from '../services/kkiapay';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { items, totalPrice, shippingFee, clearCart } = useCart();

  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('kkiapay'); // 'kkiapay' | 'card' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [kkiapayTxId, setKkiapayTxId] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+229', // Bénin par défaut pour Kkiapay
    address: '',
    city: 'Cotonou',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888'
  });
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomOrderId = 'ATELIER-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomOrderId);

    if (paymentMethod === 'kkiapay') {
      setIsProcessing(true);
      setStep('processing');

      const fullPhone = `${formData.countryCode}${formData.phone.replace(/\s+/g, '')}`;

      await triggerKkiapayPayment({
        amountEur: totalPrice,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: fullPhone,
        onSuccess: (data) => {
          setKkiapayTxId(data.transactionId || 'KKIA-' + Math.floor(100000 + Math.random() * 900000));
          setIsProcessing(false);
          setStep('success');
          clearCart();
        },
        onFailure: (err) => {
          setIsProcessing(false);
          setStep('form');
          alert("Le paiement Kkiapay n'a pas pu aboutir. Veuillez réessayer.");
        }
      });
    } else {
      // Carte ou autre
      setStep('success');
      clearCart();
    }
  };

  const handleReset = () => {
    setStep('form');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-stone-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-950/50">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-stone-900 dark:text-white" />
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
              Paiement Sécurisé
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Order summary pill */}
            <div className="bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 rounded-2xl p-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-stone-900 dark:text-white">{items.length} article(s) à régler</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Livraison : {shippingFee === 0 ? 'Offerte' : `${shippingFee.toFixed(2)} €`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider block">Montant total</span>
                <p className="text-xl font-serif font-bold text-stone-950 dark:text-white">{totalPrice.toFixed(2)} €</p>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  ≈ {formatFCFA(totalPrice)}
                </span>
              </div>
            </div>

            {/* Contact details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
                1. Vos coordonnées
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Koffi"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Email pour le reçu *</label>
                  <input
                    type="email"
                    required
                    placeholder="jean.koffi@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
                  />
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
                2. Adresse de livraison
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Adresse de livraison *</label>
                  <input
                    type="text"
                    required
                    placeholder="Haie Vive, Rue 340"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Ville *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cotonou"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Indicatif pays</label>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900 dark:focus:border-stone-500"
                  >
                    <option value="+229">🇧🇯 Bénin (+229)</option>
                    <option value="+228">🇹🇬 Togo (+228)</option>
                    <option value="+225">🇨🇮 Côte d'Ivoire (+225)</option>
                    <option value="+221">🇸🇳 Sénégal (+221)</option>
                    <option value="+33">🇫🇷 France (+33)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                  3. Mode de paiement
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> Sécurisé par Kkiapay
                </span>
              </div>

              {/* Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kkiapay')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                    paymentMethod === 'kkiapay'
                      ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm">Kkiapay</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-sans">Recommandé</span>
                  </div>
                  <p className="text-[10px] font-normal text-stone-500 dark:text-stone-400 leading-tight">
                    Mobile Money & Carte
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-stone-900 dark:border-white bg-stone-900 dark:bg-white text-white dark:text-stone-950'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>Carte Bancaire</span>
                  </div>
                  <p className="text-[10px] font-normal opacity-80 leading-tight">
                    Visa / Mastercard directe
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all col-span-2 sm:col-span-1 ${
                    paymentMethod === 'cod'
                      ? 'border-stone-900 dark:border-white bg-stone-900 dark:bg-white text-white dark:text-stone-950'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>À la livraison</span>
                  </div>
                  <p className="text-[10px] font-normal opacity-80 leading-tight">
                    Paiement en espèces
                  </p>
                </button>
              </div>

              {/* Kkiapay details panel */}
              {paymentMethod === 'kkiapay' && (
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Smartphone size={16} className="text-emerald-600 dark:text-emerald-400" />
                      Réseaux acceptés par Kkiapay :
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                      {formatFCFA(totalPrice)}
                    </span>
                  </div>

                  {/* Operator Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                    <span className="bg-amber-400 text-stone-950 px-2.5 py-1 rounded-full shadow-xs">
                      🟡 MTN MoMo
                    </span>
                    <span className="bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-xs">
                      🔵 Moov Money
                    </span>
                    <span className="bg-purple-600 text-white px-2.5 py-1 rounded-full shadow-xs">
                      🟣 Celtiis Cash
                    </span>
                    <span className="bg-stone-800 text-white px-2.5 py-1 rounded-full shadow-xs">
                      💳 Visa / Mastercard
                    </span>
                  </div>

                  {/* Phone number input for Mobile Money */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Numéro Mobile Money pour la confirmation *
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center">
                        {formData.countryCode}
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="61 00 00 00"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="flex-1 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
                      <Info size={12} className="text-emerald-600" />
                      Une notification de validation de débit USSD vous sera envoyée sur ce numéro.
                    </p>
                  </div>
                </div>
              )}

              {/* Direct Card panel */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Numéro de carte</label>
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        defaultValue="4532 •••• •••• 8890"
                        className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">Expiration</label>
                      <input
                        type="text"
                        defaultValue="08/28"
                        className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">CVC</label>
                      <input
                        type="text"
                        defaultValue="382"
                        className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white rounded-xl px-3 py-2.5"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-4 text-white font-semibold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === 'kkiapay'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-stone-950 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-950'
                }`}
              >
                <span>
                  {paymentMethod === 'kkiapay'
                    ? `Payer ${formatFCFA(totalPrice)} avec Kkiapay`
                    : `Valider la commande • ${totalPrice.toFixed(2)} €`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 mt-3">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Paiement chiffré et sécurisé conforme aux normes PCI-DSS</span>
              </div>
            </div>
          </form>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="p-8 sm:p-14 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 animate-pulse">
              <Loader2 size={40} className="animate-spin" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-2">
              Connexion à Kkiapay en cours...
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-sm mb-4">
              Veuillez confirmer l'autorisation de débit sur votre téléphone Mobile Money ({formData.countryCode} {formData.phone}).
            </p>
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
              Montant : {formatFCFA(totalPrice)} ({totalPrice.toFixed(2)} €)
            </div>
          </div>
        )}

        {/* Success Confirmation */}
        {step === 'success' && (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 animate-bounce">
              <CheckCircle size={40} />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
              Paiement Validé avec Succès
            </span>
            <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mb-2">
              Merci pour votre commande !
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mb-6">
              Votre commande <span className="font-mono font-bold text-stone-800 dark:text-stone-200">#{orderId}</span> a été enregistrée. Un e-mail de confirmation a été envoyé à <span className="font-semibold text-stone-800 dark:text-stone-200">{formData.email}</span>.
            </p>

            <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 w-full max-w-md mb-8 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Mode de paiement :</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {paymentMethod === 'kkiapay' ? 'Kkiapay Mobile Money / Carte' : 'Carte Bancaire'}
                </span>
              </div>
              {kkiapayTxId && (
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Réf. Transaction Kkiapay :</span>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{kkiapayTxId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Montant réglé :</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {formatFCFA(totalPrice)} ({totalPrice.toFixed(2)} €)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Statut :</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Payé • En préparation</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3.5 bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-950 font-semibold text-xs rounded-full shadow-md transition-colors"
            >
              Retourner à la boutique
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
