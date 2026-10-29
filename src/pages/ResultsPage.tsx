import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw, 
  Info,
  Check,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGifts } from '../context/GiftsContext';
import { rankGifts, getBudgetLabel } from '../services/recommendationEngine';
import { GiftCard } from '../components/GiftCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { FinderState, Gift, BudgetBracket } from '../types';

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const finderData = (location.state as { finderData?: FinderState } | undefined)?.finderData;
  const { gifts } = useGifts();
  const { isAdmin } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<BudgetBracket | 'all'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'rating'>('match');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    gifts.forEach((g) => set.add(g.category));
    return ['all', ...Array.from(set)];
  }, [gifts]);

  // Compute recommendations
  const rankedAll = useMemo(() => {
    if (finderData) {
      return rankGifts(finderData, gifts);
    }
    // Default ranking without wizard
    return rankGifts(
      {
        recipient: null,
        occasion: null,
        interests: [],
        budget: null,
        personalityNotes: '',
      },
      gifts
    );
  }, [finderData, gifts]);

  // Simulate smooth skeleton loading on initial mount or re-rank
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [finderData]);

  // Filter & sort
  const filteredGifts = useMemo(() => {
    let list = [...rankedAll];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((g) => g.category === selectedCategory);
    }

    // Budget filter
    if (selectedBudget !== 'all') {
      list = list.filter((g) => g.budgetBracket === selectedBudget);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'price-asc') {
        return a.priceTND - b.priceTND;
      }
      if (sortBy === 'price-desc') {
        return b.priceTND - a.priceTND;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

    return list;
  }, [rankedAll, searchQuery, selectedCategory, selectedBudget, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBudget('all');
    setSortBy('match');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedBudget !== 'all';

  return (
    <div className="pt-28 pb-24 min-h-screen bg-giftly-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-giftly-purple mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {finderData ? 'Personalized Match Gallery' : 'Curated Gift Directory'}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-giftly-dark tracking-tight">
                {finderData?.recipientName
                  ? `Perfect Gifts for ${finderData.recipientName}`
                  : 'Handpicked Gift Recommendations'}
              </h1>
              <p className="text-xs sm:text-sm text-giftly-muted mt-1">
                Showing {filteredGifts.length} thoughtful presents ranked by our compatibility algorithm.
              </p>
            </div>

            {/* Admin shortcut to add another gift */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin?action=add"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-giftly-purple to-pink-600 text-white font-bold text-xs shadow-soft hover:shadow-hover transition-all"
                  title="Ajouter un autre cadeau directement dans MySQL"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Ajouter un Cadeau</span>
                </Link>
              </div>
            )}

            {/* Recipient Profile Tag Pills if Finder Data present */}
            {finderData && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-giftly-border shadow-sm">
                {finderData.recipient && (
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-giftly-lavender-light text-giftly-purple">
                    For: {finderData.recipient.replace('-', ' ')}
                  </span>
                )}
                {finderData.occasion && (
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-giftly-pink-light text-giftly-dark">
                    Occasion: {finderData.occasion.replace('-', ' ')}
                  </span>
                )}
                {finderData.budget && (
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-giftly-peach-light text-giftly-peach-dark">
                    Budget: {getBudgetLabel(finderData.budget)}
                  </span>
                )}
                <Link
                  to="/finder"
                  className="text-[11px] font-bold text-giftly-purple underline hover:text-giftly-purple-deep pl-1"
                >
                  Edit Answers
                </Link>
              </div>
            )}
          </div>

          {/* Pricing Estimation Note */}
          <div className="p-3.5 rounded-2xl bg-giftly-peach/30 border border-giftly-peach/60 flex items-start gap-2.5 text-xs text-giftly-dark">
            <Info className="w-4 h-4 text-giftly-peach-dark flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-giftly-dark/80">
              <strong>Tunisian Dinar (TND) Pricing Notice:</strong> All listed prices are curated market estimates based on authentic artisanal workshops and specialty merchants across Tunis, Sfax, Sousse, and Djerba.
            </p>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-card border border-giftly-border mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Search Bar */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-giftly-muted absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, perfume, leather, coffee, jewelry..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-giftly-muted hover:text-giftly-dark"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all font-medium text-giftly-dark cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.filter((c) => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-giftly-muted absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Budget Select */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value as BudgetBracket | 'all')}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all font-medium text-giftly-dark cursor-pointer"
              >
                <option value="all">Any Budget</option>
                <option value="under-20">Under 20 TND</option>
                <option value="20-50">20 – 50 TND</option>
                <option value="50-100">50 – 100 TND</option>
                <option value="100-200">100 – 200 TND</option>
                <option value="above-200">Above 200 TND</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-giftly-muted absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Sort Select */}
            <div className="md:col-span-2 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all font-medium text-giftly-dark cursor-pointer"
              >
                <option value="match">✨ Best Match</option>
                <option value="rating">★ Highest Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-giftly-muted absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Quick Active Filter Pills & Reset */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-giftly-border/70 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-giftly-muted text-[11px]">Active filters:</span>
                {searchQuery && (
                  <span className="px-2.5 py-0.5 rounded-full bg-giftly-lavender-light text-giftly-purple text-[11px] font-bold">
                    "{searchQuery}"
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-giftly-pink-light text-giftly-dark text-[11px] font-bold">
                    {selectedCategory}
                  </span>
                )}
                {selectedBudget !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-giftly-peach-light text-giftly-peach-dark text-[11px] font-bold">
                    {getBudgetLabel(selectedBudget)}
                  </span>
                )}
              </div>

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-giftly-purple hover:text-giftly-purple-deep font-bold text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : filteredGifts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredGifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} showMatchScore={Boolean(finderData)} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center bg-white rounded-4xl border border-giftly-border shadow-card max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-giftly-pink-light flex items-center justify-center mx-auto text-giftly-purple">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-giftly-dark">
              No Matching Gifts Found
            </h3>
            <p className="text-xs text-giftly-muted leading-relaxed">
              We couldn't find gifts matching all selected filters. Try broadening your budget or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-giftly-purple text-white font-bold text-xs hover:bg-giftly-purple-hover transition-colors shadow-soft"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
