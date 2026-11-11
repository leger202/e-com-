# 🛍️ ATELIER & CO — Site E-commerce React

Projet e-commerce complet développé avec **React**, **Vite** et **Tailwind CSS**.

---

## 🚀 Démarrage Rapide dans Visual Studio Code (VS Code)

### 1. Extraire le projet
Décompressez l'archive `atelier-ecommerce-react.zip` dans le dossier de votre choix sur votre ordinateur.

### 2. Ouvrir dans VS Code
1. Lancez **Visual Studio Code**.
2. Allez dans le menu : **Fichier > Ouvrir le dossier...** (ou `File > Open Folder...`).
3. Sélectionnez le dossier décompressé du projet.

### 3. Installer les dépendances
1. Ouvrez le terminal intégré dans VS Code :
   - Raccourci : `Ctrl + ~` (Windows/Linux) ou `Cmd + ~` (Mac)
   - Ou via le menu : **Terminal > Nouveau terminal**
2. Tapez la commande suivante et appuyez sur Entrée :
   ```bash
   npm install
   ```

### 4. Lancer le site en développement
Dans le même terminal, exécutez :
```bash
npm run dev
```

L'adresse de votre site s'affichera (généralement `http://localhost:3000`). Cliquez dessus ou ouvrez-la dans votre navigateur pour voir votre boutique en direct avec rechargement instantané (Hot Reload) !

---

## 📁 Organisation des Fichiers

- **`src/data/products.js`** : Le fichier principal où vous ajoutez, modifiez ou supprimez vos produits dans le code (noms, prix, tailles, couleurs, descriptions).
- **`src/data/categories.js`** : Vos catégories de boutique (Femme, Homme, Accessoires, etc.).
- **`public/uploads/`** : Placez ici vos photos de produits (ex: `veste.jpg`). Elles seront directement accessibles via `"/uploads/veste.jpg"`.
- **`src/components/`** :
  - `Navbar.jsx` : Barre de menu, recherche, icône panier et favoris.
  - `HeroBanner.jsx` : Grande bannière d'accueil et réassurance client.
  - `ProductCard.jsx` : Affichage d'un article dans la grille avec badges et favoris.
  - `ProductList.jsx` : Catalogue avec filtres et tri.
  - `ProductDetailModal.jsx` : Modal de vue détaillée avec choix de taille, couleur et quantité.
  - `CartDrawer.jsx` : Panier latéral avec calcul automatique des frais de port et code promo.
  - `CheckoutModal.jsx` : Tunnel de commande et paiement simulé.
  - `Footer.jsx` : Pied de page et formulaire de newsletter.
- **`src/context/CartContext.jsx`** : Gestion centralisée du panier et des favoris avec persistance automatique (`localStorage`).

---

## 🛠️ Scripts Disponibles

- `npm run dev` : Démarre le serveur de développement local.
- `npm run build` : Compile le projet pour la mise en production dans le dossier `dist/`.
- `npm run preview` : Prévisualise la version compilée de production.
