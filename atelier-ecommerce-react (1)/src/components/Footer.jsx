import React, { useState } from 'react';
import { Mail, ArrowRight, Instagram, Facebook, Twitter, Check } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-950 text-white border-t border-stone-800">
      {/* Newsletter bar */}
      <div className="border-b border-stone-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold">Rejoignez le Cercle Privé</h3>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Recevez nos avant-premières de collections et -10% sur votre première commande.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex bg-stone-900 border border-stone-700 rounded-full p-1.5 focus-within:border-white transition-colors">
              <input
                type="email"
                required
                placeholder="Votre adresse email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm px-4 text-white focus:outline-none placeholder:text-stone-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-white hover:bg-stone-200 text-stone-950 font-semibold text-xs rounded-full flex items-center gap-1.5 transition-colors shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span>Inscrit !</span>
                  </>
                ) : (
                  <>
                    <span>S'inscrire</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-xl font-bold tracking-tight">ATELIER & CO</span>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed">
              Maison de confection et de maroquinerie moderne. Des basiques haut de gamme conçus pour traverser les saisons.
            </p>
            <div className="flex gap-4 mt-5 text-stone-400">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-300 mb-4">
              Collections
            </h4>
            <ul className="text-xs text-stone-400 space-y-2.5">
              <li><a href="#catalogue" className="hover:text-white transition-colors">Femme</a></li>
              <li><a href="#catalogue" className="hover:text-white transition-colors">Homme</a></li>
              <li><a href="#catalogue" className="hover:text-white transition-colors">Accessoires & Maroquinerie</a></li>
              <li><a href="#catalogue" className="hover:text-white transition-colors">Chaussures</a></li>
              <li><a href="#catalogue" className="hover:text-white transition-colors">Nouveautés 2026</a></li>
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-300 mb-4">
              Service Client
            </h4>
            <ul className="text-xs text-stone-400 space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Suivi de commande</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Livraisons & Retours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guide des tailles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nous contacter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Foire aux questions (FAQ)</a></li>
            </ul>
          </div>

          {/* Maison & Engagements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-300 mb-4">
              La Maison
            </h4>
            <ul className="text-xs text-stone-400 space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Notre Manifeste</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Matières éco-responsables</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nos ateliers partenaires</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentions Légales & CGV</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 text-stone-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ATELIER & CO. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-2.5 text-stone-400 text-[11px]">
            <span className="text-emerald-400 font-semibold">Paiements sécurisés Kkiapay :</span>
            <span className="bg-stone-800 px-2 py-0.5 rounded text-amber-300 font-medium">MTN MoMo</span>
            <span>•</span>
            <span className="bg-stone-800 px-2 py-0.5 rounded text-blue-300 font-medium">Moov Money</span>
            <span>•</span>
            <span className="bg-stone-800 px-2 py-0.5 rounded text-purple-300 font-medium">Celtiis</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
