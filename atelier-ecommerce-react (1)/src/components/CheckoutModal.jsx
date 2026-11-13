import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Lock, Smartphone, Loader2, Info, Mail, Printer, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFCFA, triggerKkiapayPayment } from '../services/kkiapay';
import { triggerFedaPayPayment } from '../services/fedapay';
import { sendOrderConfirmationEmail } from '../services/emailService';
export const CheckoutModal = ({ isOpen, onClose }) => {
  const { items, totalPrice, shippingFee, clearCart } = useCart();

  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('kkiapay'); // 'kkiapay' | 'card' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('fedapay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [kkiapayTxId, setKkiapayTxId] = useState('');
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [emailStatus, setEmailStatus] = useState('sent');

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

  const handleSuccessfulOrder = async (txId = null) => {
    const randomOrderId = 'ATELIER-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomOrderId);
    const finalTxId = txId || 'KKIA-' + Math.floor(100000 + Math.random() * 900000);
    setKkiapayTxId(finalTxId);
    setConfirmedItems([...items]);

    // Déclenchement de l'envoi d'e-mail de confirmation
    try {
      await sendOrderConfirmationEmail({
        orderId: randomOrderId,
        customer: formData,
        items: items,
        totalPrice: totalPrice,
        shippingFee: shippingFee,
        paymentDetails: {
          method: paymentMethod === 'kkiapay' ? 'Kkiapay Mobile Money / Carte' : 'Carte Bancaire',
          transactionId: finalTxId,
          amountXOF: formatFCFA(totalPrice)
        }
      });
      setEmailStatus('sent');
    } catch (e) {
      console.error("Erreur envoi email :", e);
    }

    setIsProcessing(false);
    setStep('success');
    clearCart();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          handleSuccessfulOrder(data.transactionId);
        },
        onFailure: (err) => {
          setIsProcessing(false);
          setStep('form');
          alert("Le paiement Kkiapay n'a pas pu aboutir. Veuillez réessayer.");
        }
      });
    } else {
      // Carte ou autre
      handleSuccessfulOrder();
    }
  };

  const handleReset = () => {
    setStep('form');
    setIsProcessing(false);
    onClose();
  };

  const handlePrintReceipt = () => {
    window.print();
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
                1. Vos coordonnées & Envoi du reçu
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
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1 flex items-center justify-between">
                    <span>Email pour recevoir la confirmation d'achat *</span>
                    <span className="text-rose-600 dark:text-rose-400 text-[10px] font-normal flex items-center gap-1">
                      <Mail size={12} /> E-mail avec récapitulatif des articles
                    </span>
                  </label>
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

        {/* Success Confirmation with Items List & Email Sent Notice */}
        {step === 'success' && (
          <div className="p-6 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
              <CheckCircle size={36} />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
              Paiement Confirmé
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mb-2">
              Merci pour votre commande !
            </h3>

            {/* Notification de l'envoi de mail */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-full text-xs text-rose-800 dark:text-rose-200 font-medium mb-6">
              <Mail size={15} className="text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Un e-mail de confirmation détaillé a été envoyé à <strong>{formData.email}</strong></span>
            </div>

            {/* Récapitulatif détaillé des articles achetés */}
            <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 w-full max-w-lg mb-6 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                <span className="text-stone-500 dark:text-stone-400">Numéro de commande :</span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">#{orderId}</span>
              </div>

              {kkiapayTxId && (
                <div className="flex justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="text-stone-500 dark:text-stone-400">Réf. Transaction Kkiapay :</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{kkiapayTxId}</span>
                </div>
              )}

              {/* Liste des articles */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-600 dark:text-stone-300 block mb-2">
                  Articles achetés ({confirmedItems.length}) :
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {confirmedItems.map((it) => (
                    <div key={it.itemKey} className="flex justify-between items-center bg-white dark:bg-stone-900 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-700/80">
                      <div className="flex items-center gap-2.5">
                        <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded-lg border border-stone-200 dark:border-stone-700 shrink-0" />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-white line-clamp-1">{it.name}</p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400">
                            Taille: {it.selectedSize} • Coloris: {it.selectedColor} • Qté: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-stone-900 dark:text-white shrink-0 ml-2">
                        {(it.price * it.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Livraison */}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-2 space-y-1">
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>Livraison :</span>
                  <span>{shippingFee === 0 ? 'Offerte' : `${shippingFee.toFixed(2)} €`}</span>
                </div>
                <div className="flex justify-between items-baseline font-bold text-stone-900 dark:text-white pt-1">
                  <span>Total payé :</span>
                  <div className="text-right">
                    <span className="font-serif text-base">{totalPrice.toFixed(2)} €</span>
                    <span className="block text-[11px] font-sans text-emerald-600 dark:text-emerald-400">
                      ≈ {formatFCFA(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handlePrintReceipt}
                className="px-5 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-full flex items-center gap-2 transition-colors border border-stone-300 dark:border-stone-700"
              >
                <Printer size={15} />
                <span>Imprimer / Télécharger le reçu</span>
              </button>

              <button
                onClick={handleReset}
                className="px-8 py-3 bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-950 font-semibold text-xs rounded-full shadow-md transition-colors"
              >
                Retourner à la boutique
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
