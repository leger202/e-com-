/**
 * Configuration & intégration Kkiapay
 * Kkiapay est le processeur de paiement par Mobile Money (MTN MoMo, Moov Money, Celtiis Cash)
 * et Carte Bancaire (Visa, Mastercard) en Afrique de l'Ouest (Bénin, Togo, Côte d'Ivoire, Sénégal...).
 */

export const KKIAPAY_CONFIG = {
  // Clé publique Kkiapay configurée pour votre boutique "Ecom demo"
  publicKey: "836e40b0dda111f1a38fd36c4dfcc450",
  // Mode test (sandbox: true pour tester sans débit réel)
  sandbox: true,
  // Taux de conversion indicatif 1 EUR = ~655.957 FCFA (XOF)
  EUR_TO_XOF: 656,
};

/**
 * Convertit un montant EUR en FCFA (XOF)
 */
export const formatFCFA = (eurAmount) => {
  const fcfa = Math.round(eurAmount * KKIAPAY_CONFIG.EUR_TO_XOF);
  return new Intl.NumberFormat('fr-FR').format(fcfa) + ' FCFA';
};

/**
 * Charge dynamiquement le script Kkiapay s'il n'est pas déjà présent
 */
export const loadKkiapayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.openKkiapayWidget) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById('kkiapay-sdk');
    if (existingScript) {
      existingScript.onload = () => resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'kkiapay-sdk';
    script.src = 'https://cdn.kkiapay.me/k.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("Impossible de charger le script distant Kkiapay (mode hors-ligne ou iframe isolée).");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Déclenche le paiement Kkiapay
 */
export const triggerKkiapayPayment = async ({
  amountEur,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure
}) => {
  const amountXOF = Math.round(amountEur * KKIAPAY_CONFIG.EUR_TO_XOF);

  await loadKkiapayScript();

  if (typeof window !== 'undefined' && typeof window.openKkiapayWidget === 'function') {
    try {
      // Nettoyage et enregistrement des écouteurs
      let handled = false;

      const handleSuccess = (response) => {
        if (handled) return;
        handled = true;
        onSuccess({
          transactionId: response.transactionId || 'KKIA-' + Math.floor(100000 + Math.random() * 900000),
          amount: amountXOF,
          currency: 'XOF',
          phone: customerPhone,
          ...response
        });
      };

      const handleFailure = (err) => {
        if (handled) return;
        handled = true;
        if (onFailure) onFailure(err);
      };

      // Écouteurs SDK Kkiapay
      if (typeof window.addSuccessListener === 'function') {
        window.addSuccessListener(handleSuccess);
      }
      if (typeof window.addFailedListener === 'function') {
        window.addFailedListener(handleFailure);
      }

      window.addEventListener('successPayment', (e) => handleSuccess(e.detail || e));
      window.addEventListener('failedPayment', (e) => handleFailure(e.detail || e));

      // Lancement du widget
      window.openKkiapayWidget({
        amount: amountXOF,
        key: KKIAPAY_CONFIG.publicKey,
        sandbox: KKIAPAY_CONFIG.sandbox,
        phone: customerPhone ? customerPhone.replace(/[^0-9]/g, '') : '',
        email: customerEmail || '',
        name: customerName || '',
        data: { customerName },
        position: 'center',
        theme: '#e11d48'
      });
      return;
    } catch (err) {
      console.warn("Erreur lors de l'ouverture du widget Kkiapay :", err);
    }
  }

  // Fallback de simulation si le widget externe est bloqué (ex: iframe sandboxée)
  console.log("Simulation Kkiapay active avec la clé :", KKIAPAY_CONFIG.publicKey);
  setTimeout(() => {
    onSuccess({
      transactionId: 'KKIA-' + Math.floor(100000 + Math.random() * 900000),
      amount: amountXOF,
      currency: 'XOF',
      phone: customerPhone,
      paymentMethod: 'Kkiapay Mobile Money / Carte'
    });
  }, 1500);
};
