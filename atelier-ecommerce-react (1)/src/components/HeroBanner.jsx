import React from 'react';
import { ArrowDown, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export const HeroBanner = ({ onShopNowClick }) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background with luxury gradient & soft image overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
          alt="Collection Mode Atelier"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 scale-105 transform hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-stone-200 text-xs font-medium uppercase tracking-widest mb-6 border border-white/20">
            <span>Automne — Hiver 2026/2027</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight sm:leading-[1.15] mb-6">
            L'Élégance Épurée, <br />
            <span className="italic font-normal text-rose-300">Taillée Pour Durer.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed mb-8 max-w-xl">
            Découvrez une collection capsule de pièces iconiques confectionnées dans les plus belles matières : cachemire doux, laine vierge et cuir pleine fleur.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onShopNowClick}
              className="px-8 py-4 bg-white text-stone-950 hover:bg-stone-100 font-semibold text-sm rounded-full tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Découvrir la Collection
            </button>
            <a
              href="#catalogue"
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-full backdrop-blur-md border border-white/25 transition-all flex items-center gap-2"
            >
              <span>Voir les pièces</span>
              <ArrowDown size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Truck size={22} className="text-rose-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Livraison 48h Offerte</p>
                <p className="text-[11px] text-stone-400">Dès 100€ de commande</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Award size={22} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Matières Supérieures</p>
                <p className="text-[11px] text-stone-400">Laine certifiée & Cuir noble</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <RotateCcw size={22} className="text-sky-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Retours Simples</p>
                <p className="text-[11px] text-stone-400">30 jours pour changer d'avis</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <ShieldCheck size={22} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Paiement Sécurisé</p>
                <p className="text-[11px] text-stone-400">CB, Apple Pay, PayPal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
