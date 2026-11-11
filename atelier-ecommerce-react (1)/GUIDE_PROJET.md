# 🛍️ Boutique E-commerce React — ATELIER & CO

Bienvenue dans votre projet React pour votre site e-commerce de mode et d'accessoires.

Le projet tourne actuellement en **direct (Live Preview)** avec Vite, React et Tailwind CSS.

---

## 🌓 Mode Sombre & Mode Clair (Dark / Light Mode)

L'application intègre un système complet de thème :
- **Bouton Soleil / Lune** présent dans la barre de navigation (Navbar).
- **Mémorisation automatique** du choix de l'utilisateur dans le navigateur (`localStorage`).
- Styles Tailwind `dark:` configurés sur l'ensemble des composants (cartes produits, panier, fiche produit, paiement, menu, etc.).

---

## 💳 Intégration du Paiement Kkiapay (Mobile Money & Carte)

L'application intègre **Kkiapay** pour les paiements en Afrique de l'Ouest (Bénin, Togo, Côte d'Ivoire, Sénégal...) :

- **Réseaux supportés** :
  - 🟡 **MTN Mobile Money (MoMo)**
  - 🔵 **Moov Money**
  - 🟣 **Celtiis Cash**
  - 💳 **Cartes Bancaires (Visa / Mastercard)**
- **Conversion automatique** en **FCFA (XOF)** en temps réel (1 € ≈ 656 FCFA) sur les fiches produits, dans le panier et lors du paiement.
- **Fichier de configuration :** `src/services/kkiapay.js`
  ```javascript
  export const KKIAPAY_CONFIG = {
    publicKey: "VOTRE_CLE_PUBLIQUE_KKIAPAY", // Obtenue sur https://kkiapay.me
    sandbox: true, // Passez à false en production
    EUR_TO_XOF: 656,
  };
  ```

---

## 💻 Gestion des Produits Uniquement par Code

Tous les produits de la boutique sont centralisés dans :
📁 **`src/data/products.js`**

### Structure type pour ajouter un produit :

```javascript
{
  id: 9,
  name: "Nom de votre article",
  category: "femme", // "femme" | "homme" | "accessoires" | "chaussures"
  price: 110.00,
  originalPrice: 130.00, // ou null si pas de promotion
  rating: 4.9,
  reviewsCount: 12,
  badge: "Nouveau", // "Nouveau" | "Bestseller" | "-20%" | null
  description: "Description de l'article...",
  details: [
    "Matière 100% naturelle",
    "Coupe ajustée",
    "Entretien facile"
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: [
    { name: "Noir", hex: "#1c1917" },
    { name: "Beige", hex: "#e5dec9" }
  ],
  image: "/uploads/mon-image.jpg", // ou URL externe
  inStock: true
}
```

### 📸 Vos images de produits :
1. Placez vos photos dans **`public/uploads/`** (ex: `robe-noire.jpg`).
2. Indiquez simplement le chemin dans `image` : `"/uploads/robe-noire.jpg"`.
