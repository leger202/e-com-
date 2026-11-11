import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/categories';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ProductList = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onQuickView
}) => {
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      // Search filter
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Stock filter
      const matchesStock = !inStockOnly || p.inStock;

      return matchesCategory && matchesSearch && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">
            Vestiaire d'Exception
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mt-1">
            {selectedCategory === 'all'
              ? 'Toutes les créations'
              : CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Collection'}
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {filteredProducts.length} {filteredProducts.length > 1 ? 'pièces disponibles' : 'pièce disponible'}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category pills for quick switch */}
          <div className="hidden sm:flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200/50 dark:border-stone-700/60">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <ArrowUpDown size={14} className="text-stone-500 dark:text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 dark:text-stone-100 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="dark:bg-stone-900">En vedette</option>
              <option value="price-asc" className="dark:bg-stone-900">Prix : croissant</option>
              <option value="price-desc" className="dark:bg-stone-900">Prix : décroissant</option>
              <option value="rating" className="dark:bg-stone-900">Meilleures notes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800">
          <SlidersHorizontal size={40} className="mx-auto text-stone-400 mb-3" />
          <h3 className="text-lg font-serif font-bold text-stone-800 dark:text-stone-100">
            Aucun article trouvé
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 max-w-md mx-auto">
            {searchQuery
              ? `Aucun résultat ne correspond à votre recherche "${searchQuery}".`
              : "Aucun article n'est disponible dans cette sélection."}
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
            }}
            className="mt-4 px-5 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-xs font-semibold rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </section>
  );
};
