/**
 * Service d'envoi d'e-mail de confirmation de commande
 * 
 * Envoie automatiquement :
 * 1. Une notification détaillée au marchand (xerxicocac@outlook.com) avec tous les articles commandés.
 * 2. Un e-mail de confirmation au client avec son reçu officiel.
 */

export const EMAIL_CONFIG = {
  // Votre e-mail administrateur/boutique configuré
  storeNotificationEmail: "xerxicocac@outlook.com",

  // Identifiants EmailJS connectés avec Outlook
  serviceId: "service_h1xtn9m",
  templateId: "template_xjt9h43",
  publicKey: "-90UewWasuK8bpucb",
};

/**
 * Génère le modèle HTML complet du reçu de commande
 */
export const generateOrderReceiptHtml = ({
  orderId,
  customer,
  items,
  totalPrice,
  shippingFee,
  paymentDetails
}) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br/>
        <span style="font-size: 12px; color: #666;">Taille : ${item.selectedSize} | Coloris : ${item.selectedColor}</span>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)} €</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; background: #ffffff; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px;">
      <div style="text-align: center; border-bottom: 2px solid #1c1917; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">ATELIER & CO</h1>
        <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; color: #78716c; letter-spacing: 3px;">Confirmation de commande</p>
      </div>

      <p style="font-size: 15px;">Bonjour <strong>${customer.firstName} ${customer.lastName}</strong>,</p>
      <p style="font-size: 14px; color: #444; line-height: 1.5;">
        Nous vous remercions pour votre achat ! Votre commande <strong style="color: #e11d48;">#${orderId}</strong> a bien été enregistrée et est actuellement en cours de préparation dans notre atelier.
      </p>

      <div style="background: #fafaf9; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px;">
        <h3 style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; color: #1c1917;">Détails de la livraison :</h3>
        <p style="margin: 2px 0;"><strong>Destinataire :</strong> ${customer.firstName} ${customer.lastName}</p>
        <p style="margin: 2px 0;"><strong>Adresse :</strong> ${customer.address}, ${customer.city}</p>
        <p style="margin: 2px 0;"><strong>Téléphone / Mobile Money :</strong> ${customer.countryCode || ''} ${customer.phone || 'Non renseigné'}</p>
        <p style="margin: 2px 0;"><strong>Email :</strong> ${customer.email}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <thead>
          <tr style="background: #f5f5f4; text-align: left; font-size: 11px; text-transform: uppercase; color: #57534e;">
            <th style="padding: 8px;">Article</th>
            <th style="padding: 8px; text-align: center;">Qté</th>
            <th style="padding: 8px; text-align: right;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="border-top: 1px solid #e7e5e4; padding-top: 12px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Sous-total :</span>
          <span>${(totalPrice - shippingFee).toFixed(2)} €</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Livraison :</span>
          <span>${shippingFee === 0 ? 'Offerte' : `${shippingFee.toFixed(2)} €`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #d6d3d1;">
          <span>Total TTC :</span>
          <span>${totalPrice.toFixed(2)} € (${paymentDetails?.amountXOF || ''})</span>
        </div>
      </div>

      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin-top: 20px; font-size: 12px; color: #065f46;">
        <strong>Mode de règlement :</strong> ${paymentDetails?.method || 'Kkiapay'}<br/>
        <strong>Réf. Transaction Kkiapay :</strong> ${paymentDetails?.transactionId || 'N/A'}<br/>
        <strong>Statut :</strong> Paiement validé avec succès
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; font-size: 11px; color: #a8a29e;">
        <p>Une question sur votre commande ? Répondez simplement à cet e-mail.</p>
        <p>© 2026 ATELIER & CO. Tous droits réservés.</p>
      </div>
    </div>
  `;
};

/**
 * Envoie l'e-mail de confirmation au client et à la boîte marchand (xerxicocac@outlook.com)
 */
export const sendOrderConfirmationEmail = async ({
  orderId,
  customer,
  items,
  totalPrice,
  shippingFee,
  paymentDetails
}) => {
  const receiptHtml = generateOrderReceiptHtml({
    orderId,
    customer,
    items,
    totalPrice,
    shippingFee,
    paymentDetails
  });

  const itemsSummaryText = items.map(it => `- ${it.name} (Taille: ${it.selectedSize}, Couleur: ${it.selectedColor}, Qté: ${it.quantity}) : ${(it.price * it.quantity).toFixed(2)} €`).join('\n');

  console.log("Envoi de notification de commande à :", EMAIL_CONFIG.storeNotificationEmail);
  console.log("Copie client adressée à :", customer.email);

  // 1. Notification marchand vers votre boîte xerxicocac@outlook.com
  try {
    fetch(`https://formsubmit.co/ajax/${EMAIL_CONFIG.storeNotificationEmail}`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `🛍️ Nouvelle Commande #${orderId} - ${paymentDetails?.amountXOF || (totalPrice.toFixed(2) + ' €')}`,
        "Numéro de Commande": `#${orderId}`,
        "Nom du Client": `${customer.firstName} ${customer.lastName}`,
        "Email du Client": customer.email,
        "Téléphone / MoMo": `${customer.countryCode || ''} ${customer.phone || ''}`,
        "Adresse de Livraison": `${customer.address}, ${customer.city}`,
        "Articles Commandés": itemsSummaryText,
        "Total Payé": `${totalPrice.toFixed(2)} € (${paymentDetails?.amountXOF || ''})`,
        "Réf Transaction Kkiapay": paymentDetails?.transactionId || 'N/A',
        "Mode de Paiement": paymentDetails?.method || 'Kkiapay'
      })
    }).then(res => res.json()).then(data => {
      console.log("Notification marchand envoyée :", data);
    }).catch(err => {
      console.warn("Notification FormSubmit :", err);
    });
  } catch (err) {
    console.warn("Erreur envoi notification marchand :", err);
  }

  // 2. Envoi direct au client via EmailJS
  if (
    typeof window !== 'undefined' &&
    window.emailjs &&
    EMAIL_CONFIG.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY"
  ) {
    try {
      if (typeof window.emailjs.init === 'function') {
        window.emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });
      }
      const res = await window.emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        {
          order_id: orderId,
          to_name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          to_email: customer.email,
          user_email: customer.email,
          reply_to: customer.email,
          message_html: receiptHtml,
          total_price: `${totalPrice.toFixed(2)} € (${paymentDetails?.amountXOF || ''})`,
          shipping_address: `${customer.address}, ${customer.city}`,
          phone: `${customer.countryCode || ''} ${customer.phone || ''}`
        },
        EMAIL_CONFIG.publicKey
      );
      console.log("E-mail envoyé avec succès via EmailJS :", res);
    } catch (error) {
      console.warn("Erreur EmailJS client :", error);
    }
  }

  return {
    success: true,
    storeRecipient: EMAIL_CONFIG.storeNotificationEmail,
    customerRecipient: customer.email,
    receiptHtml
  };
};
