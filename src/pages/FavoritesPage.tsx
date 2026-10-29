import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { useGifts } from '../context/GiftsContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { GiftCard } from '../components/GiftCard';

export const FavoritesPage: React.FC = () => {
  const { favorites, favoritesCount } = useFavorites();
  const { user, openAuthModal, isDemoMode } = useAuth();
  const { gifts } = useGifts();

  const favoritedGifts = gifts.filter((g) => favorites.includes(g.id));

  return (
    <div className="pt-28 pb-24 min-h-screen bg-giftly-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600">
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>Your Personal Wishlist</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-giftly-dark tracking-tight">
                Saved Favorites
              </h1>
              <p className="text-xs sm:text-sm text-giftly-muted mt-1">
                You have {favoritesCount} {favoritesCount === 1 ? 'gift' : 'gifts'} saved for upcoming birthdays, holidays, and milestones.
              </p>
            </div>

            {!user && (
              <div className="p-3 bg-giftly-lavender-light border border-giftly-lavender rounded-2xl flex items-center gap-3">
                <span className="text-xs text-giftly-dark font-medium">
                  Sign in to keep your favorites synchronized across devices.
                </span>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-full bg-giftly-purple text-white text-xs font-bold hover:bg-giftly-purple-hover transition-colors shadow-sm whitespace-nowrap"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gallery or Empty State */}
        {favoritedGifts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {favoritedGifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} showMatchScore={false} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center bg-white rounded-4xl border border-giftly-border shadow-card max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 fill-pink-100 text-pink-400" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-giftly-dark">
              No Favorites Saved Yet
            </h3>
            <p className="text-xs text-giftly-muted leading-relaxed">
              When exploring gifts, click the heart icon on any card to save it here for quick access later.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/finder"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-giftly-purple to-giftly-lavender-dark text-white font-bold text-xs shadow-soft hover:shadow-hover transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-giftly-peach" />
                <span>Launch Gift Finder</span>
              </Link>
              <Link
                to="/discover"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-giftly-border bg-white text-giftly-dark hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Browse All Gifts
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
