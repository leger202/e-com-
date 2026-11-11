export const PRODUCTS = [
  {
    id: 1,
    name: "Manteau Long en Laine Ceinturé",
    category: "femme",
    price: 189.00,
    originalPrice: 229.00,
    rating: 4.9,
    reviewsCount: 42,
    badge: "Bestseller",
    description: "Manteau long confectionné dans un drap de laine doux et chaud. Coupe droite structurée avec ceinture amovible et col tailleur intemporel.",
    details: [
      "75% Laine vierge, 25% Cachemire",
      "Doublure satinée ton sur ton",
      "Poches latérales passepoilées",
      "Nettoyage à sec recommandé"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Camel", hex: "#b48455" },
      { name: "Noir Onyx", hex: "#1c1917" },
      { name: "Gris Anthracite", hex: "#4b5563" }
    ],
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    inStock: true
  },
  {
    id: 2,
    name: "Veste Blazer Structurée Oversize",
    category: "femme",
    price: 129.50,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 28,
    badge: "Nouveau",
    description: "Blazer à boutonnage croisé aux épaules légèrement accentuées pour une silhouette moderne et affirmée. Idéal en journée comme en soirée.",
    details: [
      "Tissu sergé infroissable",
      "Boutons effet corne gravés",
      "Fente d'aisance au dos",
      "Fabrication responsable"
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Beige Crème", hex: "#f5f0e8" },
      { name: "Noir Profond", hex: "#0a0a0a" }
    ],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    inStock: true
  },
  {
    id: 3,
    name: "Pull Col Roulé en Cachemire Pur",
    category: "homme",
    price: 145.00,
    originalPrice: 175.00,
    rating: 4.9,
    reviewsCount: 56,
    badge: "-17%",
    description: "Une pièce essentielle de la garde-robe masculine. Tricoté en 100% cachemire deux fils pour une douceur exceptionnelle et une chaleur naturelle.",
    details: [
      "100% Cachemire peigné de Mongolie",
      "Bords-côtes renforcés au col et aux poignets",
      "Coupe regular élégante",
      "Lavage à la main à l'eau froide"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Bleu Nuit", hex: "#1e293b" },
      { name: "Gris Chiné", hex: "#9ca3af" },
      { name: "Bordeaux", hex: "#881337" }
    ],
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    inStock: true
  },
  {
    id: 4,
    name: "Chemise Oxford Coupe Ajustée",
    category: "homme",
    price: 79.00,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 33,
    badge: null,
    description: "Chemise tissée dans un coton Oxford épais et résistant. Col boutonné soigné pour un style casual-chic en toutes circonstances.",
    details: [
      "100% Coton biologique certifié GOTS",
      "Boutons en nacre naturelle",
      "Pli creux au dos pour une liberté de mouvement",
      "Repassage facile"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blanc Pur", hex: "#ffffff" },
      { name: "Bleu Ciel", hex: "#bfdbfe" },
      { name: "Rayé Marine", hex: "#3b82f6" }
    ],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    inStock: true
  },
  {
    id: 5,
    name: "Sac Cabas Cuir Grainé 'L'Élégant'",
    category: "accessoires",
    price: 210.00,
    originalPrice: 245.00,
    rating: 5.0,
    reviewsCount: 64,
    badge: "Coup de Cœur",
    description: "Sac à main spacieux conçu en cuir de vachette pleine fleur au grain délicat. Finitions métalliques dorées polies à la main.",
    details: [
      "100% Cuir de vachette pleine fleur certifié LWG",
      "Compartiment pour ordinateur portable 14\"",
      "Poche zippée sécurisée intérieure",
      "Dimensions : 38 x 28 x 14 cm"
    ],
    sizes: ["Taille Unique"],
    colors: [
      { name: "Cognac", hex: "#9a4925" },
      { name: "Noir Intense", hex: "#171717" },
      { name: "Vert Forêt", hex: "#14532d" }
    ],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    inStock: true
  },
  {
    id: 6,
    name: "Boots Chelsea en Daim Véritable",
    category: "chaussures",
    price: 165.00,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 19,
    badge: "Nouveau",
    description: "Boots iconiques Chelsea avec empiècements élastiques latéraux et semelle en crêpe naturel offrant confort et amorti toute la journée.",
    details: [
      "Empeigne en cuir suédé hydrofuge",
      "Doublure et première de propreté en cuir",
      "Tirette arrière en gros-grain pour un enfilage aisé",
      "Fabriquées au Portugal"
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Brun Tabac", hex: "#78350f" },
      { name: "Sable", hex: "#d6c7a1" },
      { name: "Noir Mat", hex: "#262626" }
    ],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    inStock: true
  },
  {
    id: 7,
    name: "Sneakers Minimalistes Cuir Blanc",
    category: "chaussures",
    price: 135.00,
    originalPrice: 150.00,
    rating: 4.9,
    reviewsCount: 88,
    badge: "Essentiel",
    description: "La basket blanche épurée par excellence. Dessinée avec des lignes nettes et montées sur une semelle cousue durable.",
    details: [
      "Cuir nappa souple pleine fleur",
      "Semelle extérieure en caoutchouc recyclé",
      "Semelle intérieure anatomique amovible",
      "Lacets en coton ciré"
    ],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    colors: [
      { name: "Blanc / Blanc", hex: "#f8fafc" },
      { name: "Blanc / Talon Vert", hex: "#15803d" }
    ],
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    inStock: true
  },
  {
    id: 8,
    name: "Écharpe Frangée Laine & Soie",
    category: "accessoires",
    price: 65.00,
    originalPrice: null,
    rating: 4.6,
    reviewsCount: 15,
    badge: null,
    description: "Écharpe généreuse au tissage chevron subtil, douce contre la peau avec finitions frangées délicates.",
    details: [
      "80% Laine mérinos extra-fine, 20% Soie",
      "Dimensions : 200 x 70 cm",
      "Tissage artisanal léger et chaud",
      "Finition bords frangés à la main"
    ],
    sizes: ["Taille Unique"],
    colors: [
      { name: "Gris Perle", hex: "#d1d5db" },
      { name: "Rose Poudré", hex: "#fbcfe8" },
      { name: "Camel Doux", hex: "#c29b7f" }
    ],
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80",
    inStock: true
  }
];
