import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, Send, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-transparent via-[#FBF5F8] to-[#F5ECF2] border-t border-giftly-border/80 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-giftly-purple to-giftly-lavender-dark flex items-center justify-center text-white shadow-soft">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-giftly-dark">
                GIFTLY
              </span>
            </Link>
            <p className="text-sm text-giftly-muted max-w-sm leading-relaxed">
              "Make Every Gift Unforgettable." Thoughtful surprises, perfectly matched to their personality and life's sweetest milestones.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-giftly-muted pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Tunisian Dinar (TND) Live Pricing Estimates</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-giftly-dark">
              Discovery
            </h4>
            <ul className="space-y-2 text-sm text-giftly-muted">
              <li>
                <Link to="/discover" className="hover:text-giftly-purple transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/finder" className="hover:text-giftly-purple transition-colors">
                  Interactive Gift Finder
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-giftly-purple transition-colors">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link to="/discover?budget=under-20" className="hover:text-giftly-purple transition-colors">
                  Under 20 TND
                </Link>
              </li>
              <li>
                <Link to="/discover?budget=above-200" className="hover:text-giftly-purple transition-colors">
                  Luxury Over 200 TND
                </Link>
              </li>
            </ul>
          </div>

          {/* Occasions */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-giftly-dark">
              Occasions
            </h4>
            <ul className="space-y-2 text-sm text-giftly-muted">
              <li>
                <Link to="/finder?occasion=birthday" className="hover:text-giftly-purple transition-colors">
                  Birthdays
                </Link>
              </li>
              <li>
                <Link to="/finder?occasion=graduation" className="hover:text-giftly-purple transition-colors">
                  Graduation
                </Link>
              </li>
              <li>
                <Link to="/finder?occasion=anniversary" className="hover:text-giftly-purple transition-colors">
                  Anniversaries
                </Link>
              </li>
              <li>
                <Link to="/finder?occasion=wedding" className="hover:text-giftly-purple transition-colors">
                  Weddings
                </Link>
              </li>
              <li>
                <Link to="/finder?occasion=spontaneous" className="hover:text-giftly-purple transition-colors">
                  Spontaneous Surprises
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-giftly-dark">
              The Gift Journal
            </h4>
            <p className="text-xs text-giftly-muted leading-relaxed">
              Curated gift inspirations, seasonal artisan edits, and wrapping masterclasses.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>You're on the VIP gift list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-full text-xs bg-white border border-giftly-border focus:outline-none focus:border-giftly-purple shadow-sm transition-all"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1 top-1 w-8 h-8 rounded-full bg-giftly-purple text-white flex items-center justify-center hover:bg-giftly-purple-hover transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-giftly-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-giftly-muted">
          <p>© {new Date().getFullYear()} GIFTLY Inc. Designed for unforgettable moments.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" /> for meaningful gifting
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
