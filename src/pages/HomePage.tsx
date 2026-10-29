import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, Gift, Check, Compass, Star, Smile, Shield } from 'lucide-react';
import { useGifts } from '../context/GiftsContext';
import { GiftCard } from '../components/GiftCard';
import { OccasionType } from '../types';

const OCCASIONS: { id: OccasionType; label: string; count: string; image: string; tag: string }[] = [
  {
    id: 'birthday',
    label: 'Birthdays',
    count: '34 Curated Gifts',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    tag: 'Most Popular',
  },
  {
    id: 'anniversary',
    label: 'Anniversaries',
    count: '26 Keepsakes',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    tag: 'Romantic',
  },
  {
    id: 'graduation',
    label: 'Graduation',
    count: '19 Milestones',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    tag: 'Celebration',
  },
  {
    id: 'wedding',
    label: 'Weddings',
    count: '28 Heirlooms',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    tag: 'Timeless',
  },
  {
    id: 'thank-you',
    label: 'Thank-You Gifts',
    count: '22 Tokens',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    tag: 'Gratitude',
  },
  {
    id: 'spontaneous',
    label: 'Just Because',
    count: '31 Delights',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    tag: 'Spontaneous',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { gifts } = useGifts();
  const [selectedCollectionTab, setSelectedCollectionTab] = useState<'all' | 'under50' | 'bestsellers' | 'handcrafted'>('all');

  const filteredGifts = gifts.filter((gift) => {
    if (selectedCollectionTab === 'under50') return gift.priceTND <= 50;
    if (selectedCollectionTab === 'bestsellers') return gift.isPopular;
    if (selectedCollectionTab === 'handcrafted') return gift.interests.includes('handmade');
    return true;
  }).slice(0, 8);

  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 hero-gradient">
        {/* Floating Decorative Elements */}
        <div className="absolute top-24 left-10 w-64 h-64 bg-giftly-pink/40 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-giftly-lavender/50 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-giftly-peach/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-giftly-pink shadow-sm backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-giftly-purple animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-giftly-purple">
                  Tunisia’s Premier Gift Concierge
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-giftly-dark tracking-tight leading-[1.12]">
                Find the gift that <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-giftly-purple via-[#9366E8] to-[#E27D8C] bg-clip-text text-transparent">
                    says everything.
                  </span>
                  <span className="absolute left-0 bottom-1 w-full h-3 bg-giftly-pink/60 -z-10 rounded-full -rotate-1"></span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-giftly-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Thoughtful surprises, perfectly matched to their personality. Discover tailored treasures with authentic artisan details, bespoke wrapping ideas, and heartfelt cards.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/finder"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-giftly-purple to-giftly-lavender-dark text-white font-bold text-sm shadow-hover hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 text-giftly-peach" />
                  <span>Discover Their Perfect Gift</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#collections"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-giftly-pink-light border border-giftly-border text-giftly-dark font-bold text-sm shadow-soft hover:shadow-card transition-all duration-200"
                >
                  <Compass className="w-4 h-4 text-giftly-purple" />
                  <span>Explore Collections</span>
                </a>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-6 border-t border-giftly-border/70 flex items-center justify-center lg:justify-start gap-8 text-xs text-giftly-muted">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Member" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Member" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Member" />
                  </div>
                  <span className="font-semibold text-giftly-dark">1,200+ Happy Moments</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-giftly-dark">4.9 / 5</span>
                  <span>Artisan Rating</span>
                </div>
              </div>
            </div>

            {/* Right Asymmetric Editorial Art Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-modal border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                    alt="Luxury Pastel Gift Box"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold tracking-widest text-giftly-purple uppercase">
                          Featured Selection
                        </span>
                        <h4 className="font-display font-bold text-sm text-giftly-dark">
                          Bespoke Ceramic & Candle Box
                        </h4>
                      </div>
                      <span className="font-display font-bold text-sm text-giftly-purple bg-giftly-lavender-light px-2.5 py-1 rounded-full">
                        48 TND
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Micro-Card 1: Recommendation Match */}
                <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-hover border border-giftly-border flex items-center gap-3 animate-float-slow">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-giftly-muted">Algorithm Match</p>
                    <p className="text-xs font-extrabold text-giftly-dark">98% Personality Score</p>
                  </div>
                </div>

                {/* Floating Micro-Card 2: Tunisian Dinars Badge */}
                <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-hover border border-giftly-border flex items-center gap-2.5 animate-float-reverse">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-giftly-dark">Authentic Local Sellers</p>
                    <p className="text-[10px] text-giftly-muted">Verified TND Estimates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OCCASIONS SECTION */}
      <section id="occasions" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-giftly-purple">
              Every Milestone Matters
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-giftly-dark">
              Shop by Meaningful Occasion
            </h2>
            <p className="text-sm text-giftly-muted max-w-lg">
              Whether celebrating a high-honor graduation, a sweet birthday, or a spontaneous surprise, find tokens designed for the moment.
            </p>
          </div>
          <Link
            to="/finder"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-giftly-purple hover:text-giftly-purple-deep transition-colors"
          >
            <span>Launch Interactive Finder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Occasion Image Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => navigate(`/finder?occasion=${occ.id}`)}
              className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-hover hover:-translate-y-2 transition-all duration-300"
            >
              <img
                src={occ.image}
                alt={occ.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

              {/* Tag */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-giftly-dark">
                  {occ.tag}
                </span>
              </div>

              {/* Label */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5">
                <h3 className="font-display font-bold text-sm text-white group-hover:text-giftly-peach transition-colors">
                  {occ.label}
                </h3>
                <p className="text-[11px] text-white/80">{occ.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CURATED COLLECTION SECTION */}
      <section id="collections" className="py-20 bg-gradient-to-b from-[#FFF5FA] to-giftly-bg border-y border-giftly-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-giftly-purple">
              Handpicked Catalog
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-giftly-dark">
              Curated Gift Collections
            </h2>
            <p className="text-sm text-giftly-muted">
              Explore authentic gifts crafted by local artisans and international specialty creators, all priced in Tunisian Dinars.
            </p>

            {/* Filter Tabs */}
            <div className="inline-flex p-1.5 rounded-full bg-white border border-giftly-border shadow-sm mt-4">
              <button
                onClick={() => setSelectedCollectionTab('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCollectionTab === 'all'
                    ? 'bg-giftly-purple text-white shadow-soft'
                    : 'text-giftly-muted hover:text-giftly-dark'
                }`}
              >
                All Gifts
              </button>
              <button
                onClick={() => setSelectedCollectionTab('under50')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCollectionTab === 'under50'
                    ? 'bg-giftly-purple text-white shadow-soft'
                    : 'text-giftly-muted hover:text-giftly-dark'
                }`}
              >
                Under 50 TND
              </button>
              <button
                onClick={() => setSelectedCollectionTab('bestsellers')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCollectionTab === 'bestsellers'
                    ? 'bg-giftly-purple text-white shadow-soft'
                    : 'text-giftly-muted hover:text-giftly-dark'
                }`}
              >
                Most Loved
              </button>
              <button
                onClick={() => setSelectedCollectionTab('handcrafted')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCollectionTab === 'handcrafted'
                    ? 'bg-giftly-purple text-white shadow-soft'
                    : 'text-giftly-muted hover:text-giftly-dark'
                }`}
              >
                Artisan Crafted
              </button>
            </div>
          </div>

          {/* Gift Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredGifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} showMatchScore={false} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-giftly-pink-light border border-giftly-border text-giftly-dark font-bold text-xs shadow-soft hover:shadow-card transition-all"
            >
              <span>View All 22+ Curated Gifts</span>
              <ArrowRight className="w-4 h-4 text-giftly-purple" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW GIFTLY WORKS SECTION */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-giftly-purple">
            Effortless Gifting
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-giftly-dark">
            How GIFTLY Works
          </h2>
          <p className="text-sm text-giftly-muted">
            Three simple steps between wondering what to give and witnessing their unforgettable smile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white border border-giftly-border shadow-card relative hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-giftly-pink flex items-center justify-center text-giftly-dark font-extrabold text-xl mb-6 shadow-soft">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-giftly-dark mb-2">
              Share Who They Are
            </h3>
            <p className="text-xs text-giftly-muted leading-relaxed">
              Tell us their relationship, their favorite passions (photography, books, coffee, art), and set your budget in Tunisian Dinars.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white border border-giftly-border shadow-card relative hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-giftly-lavender flex items-center justify-center text-giftly-purple font-extrabold text-xl mb-6 shadow-soft">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-giftly-dark mb-2">
              Intelligent Matching
            </h3>
            <p className="text-xs text-giftly-muted leading-relaxed">
              Our recommendation algorithm calculates personality match percentages and reveals why each item was selected specifically for them.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white border border-giftly-border shadow-card relative hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-giftly-peach flex items-center justify-center text-giftly-peach-dark font-extrabold text-xl mb-6 shadow-soft">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-giftly-dark mb-2">
              Gift With Emotion
            </h3>
            <p className="text-xs text-giftly-muted leading-relaxed">
              Enjoy tailored wrapping ideas and customize personalized gift cards generated in poetic, heartfelt, or witty tones.
            </p>
          </div>
        </div>

        {/* Hero CTA Banner */}
        <div className="mt-16 rounded-4xl bg-gradient-to-r from-giftly-purple via-giftly-lavender-dark to-purple-800 p-8 sm:p-12 text-white shadow-modal flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Ready to find their unforgettable gift?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg">
              Answer 5 quick questions and receive a curated shortlist of presents matched to their unique personality.
            </p>
          </div>
          <Link
            to="/finder"
            className="px-8 py-4 rounded-full bg-white text-giftly-purple hover:bg-giftly-peach font-bold text-xs sm:text-sm shadow-hover hover:scale-105 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-giftly-purple" />
            <span>Start Gift Finder</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
