import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Gift } from '../types';
import { useFavorites } from '../context/FavoritesContext';

interface GiftCardProps {
  gift: Gift;
  showMatchScore?: boolean;
}

export const GiftCard: React.FC<GiftCardProps> = ({ gift, showMatchScore = true }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(gift.id);

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-giftly-border/80 shadow-card hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-giftly-pink-light">
        <img
          src={gift.image}
          alt={gift.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for subtle text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/95 backdrop-blur-md text-giftly-dark shadow-sm">
            {gift.category}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(gift.id);
          }}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-md ${
            favorited
              ? 'bg-pink-500 text-white scale-110 shadow-pink-200'
              : 'bg-white/90 text-giftly-dark hover:text-pink-600 hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
        </button>

        {/* Match Score Badge (if present) */}
        {showMatchScore && gift.matchScore && (
          <div className="absolute bottom-3 left-3.5">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-giftly-purple to-giftly-lavender-dark text-white shadow-soft">
              <Sparkles className="w-3 h-3 text-giftly-peach" />
              {gift.matchScore}% Match
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Price & Rating Row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-extrabold text-xl text-giftly-dark tracking-tight">
                {gift.priceTND} <span className="text-xs font-semibold text-giftly-purple">TND</span>
              </span>
              {gift.originalPriceTND && (
                <span className="text-xs text-giftly-muted/70 line-through">
                  {gift.originalPriceTND} TND
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-giftly-dark bg-giftly-peach/30 px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{gift.rating.toFixed(1)}</span>
              <span className="text-giftly-muted text-[10px]">({gift.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/gift/${gift.id}`}>
            <h3 className="font-display font-bold text-base text-giftly-dark hover:text-giftly-purple transition-colors line-clamp-1">
              {gift.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-giftly-muted line-clamp-2 mt-1 leading-relaxed">
            {gift.subtitle || gift.description}
          </p>
        </div>

        {/* Why this gift matches */}
        {gift.whyMatches && (
          <div className="p-2.5 rounded-2xl bg-giftly-lavender-light border border-giftly-lavender/60 text-xs text-giftly-dark">
            <div className="flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-giftly-purple flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2 text-[11px] leading-relaxed italic text-giftly-dark/90 font-medium">
                "{gift.whyMatches}"
              </p>
            </div>
          </div>
        )}

        {/* Footer Card Actions */}
        <div className="pt-2 border-t border-giftly-border/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-giftly-muted text-[11px]">
            {gift.isVerifiedSeller && (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Seller</span>
              </>
            )}
          </div>

          <Link
            to={`/gift/${gift.id}`}
            className="inline-flex items-center gap-1.5 font-bold text-giftly-purple hover:text-giftly-purple-deep group/link transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
