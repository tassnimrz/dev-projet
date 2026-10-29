import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  Package, 
  Mail, 
  Copy, 
  Check, 
  Share2, 
  Star, 
  ShieldCheck, 
  Gift as GiftIcon,
  HelpCircle,
  Wand2
} from 'lucide-react';
import { useGifts } from '../context/GiftsContext';
import { useFavorites } from '../context/FavoritesContext';
import { generatePersonalizedCardMessage, MessageTone } from '../services/aiService';

export const GiftDetailPage: React.FC = () => {
  const { giftId } = useParams<{ giftId: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { gifts } = useGifts();

  const gift = gifts.find((g) => g.id === giftId) || gifts[0];
  const [activeImage, setActiveImage] = useState<string>(gift.image);

  // Personalized Message Generator State
  const [recipientName, setRecipientName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('friend');
  const [occasion, setOccasion] = useState<string>('birthday');
  const [tone, setTone] = useState<MessageTone>('heartfelt');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedMessage, setGeneratedMessage] = useState<string>(gift.sampleCardMessage);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const favorited = isFavorite(gift.id);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const msg = await generatePersonalizedCardMessage({
        recipientName,
        relationship,
        occasion,
        giftTitle: gift.title,
        tone,
      });
      setGeneratedMessage(msg);
    } catch {
      // Fallback message
      setGeneratedMessage(gift.sampleCardMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-giftly-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-giftly-dark hover:text-giftly-purple transition-colors px-3 py-1.5 rounded-full hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-giftly-border text-xs font-bold text-giftly-dark hover:border-giftly-purple hover:text-giftly-purple transition-colors shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Gift'}</span>
          </button>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Visual Photography Showcase */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] rounded-4xl overflow-hidden bg-giftly-pink-light border border-giftly-border shadow-card">
              <img
                src={activeImage}
                alt={gift.title}
                className="w-full h-full object-cover"
              />
              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-giftly-dark shadow-sm">
                  {gift.category}
                </span>
              </div>
            </div>

            {/* Thumbnails Gallery */}
            {gift.additionalImages && gift.additionalImages.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveImage(gift.image)}
                  className={`w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === gift.image
                      ? 'border-giftly-purple ring-2 ring-giftly-purple/30 scale-105'
                      : 'border-giftly-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={gift.image} alt="Thumbnail main" className="w-full h-full object-cover" />
                </button>
                {gift.additionalImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? 'border-giftly-purple ring-2 ring-giftly-purple/30 scale-105'
                        : 'border-giftly-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Presentation & Wrapping Idea Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-giftly-peach-light via-white to-giftly-pink-light border border-giftly-peach/60 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-giftly-peach-dark font-extrabold text-xs uppercase tracking-wider">
                <Package className="w-4 h-4" />
                <span>GIFTLY Signature Wrapping Idea</span>
              </div>
              <p className="text-xs text-giftly-dark/90 leading-relaxed italic">
                "{gift.wrappingIdea}"
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-giftly-muted">
                <GiftIcon className="w-3.5 h-3.5 text-giftly-purple" />
                <span>Presentation elevates every gift into a keepsake memory.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Gift Details & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Rating & Seller Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-giftly-dark bg-giftly-peach/30 px-3 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{gift.rating.toFixed(1)}</span>
                  <span className="text-giftly-muted font-normal">({gift.reviewsCount} reviews)</span>
                </div>

                {gift.isVerifiedSeller && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{gift.sellerName || 'Verified Artisan'}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-giftly-dark leading-snug">
                {gift.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm text-giftly-muted mt-1 leading-relaxed">
                {gift.subtitle}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-display font-black text-3xl text-giftly-dark tracking-tight">
                  {gift.priceTND} <span className="text-lg font-bold text-giftly-purple">TND</span>
                </span>
                {gift.originalPriceTND && (
                  <span className="text-sm text-giftly-muted line-through">
                    {gift.originalPriceTND} TND
                  </span>
                )}
                <span className="text-[11px] font-semibold text-giftly-muted bg-slate-100 px-2 py-0.5 rounded-md">
                  Estimated Price in Tunisia
                </span>
              </div>
            </div>

            {/* Why This Matches Card */}
            <div className="p-4 rounded-2xl bg-giftly-lavender-light border border-giftly-lavender space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-giftly-purple uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Why This Matches Them</span>
              </div>
              <p className="text-xs text-giftly-dark leading-relaxed font-medium">
                {gift.whyMatches}
              </p>
            </div>

            {/* Full Story Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-giftly-dark">
                The Story & Craftsmanship
              </h3>
              <p className="text-xs sm:text-sm text-giftly-muted leading-relaxed">
                {gift.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {gift.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-slate-100 text-giftly-dark text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Primary Action Button: Favorite */}
            <div className="pt-4 border-t border-giftly-border flex items-center gap-3">
              <button
                onClick={() => toggleFavorite(gift.id)}
                className={`flex-1 py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-soft ${
                  favorited
                    ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200'
                    : 'bg-giftly-purple text-white hover:bg-giftly-purple-hover'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
                <span>{favorited ? 'Saved in Your Favorites' : 'Add to Favorites'}</span>
              </button>

              <Link
                to="/finder"
                className="px-5 py-3.5 rounded-full border border-giftly-border bg-white text-giftly-dark hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Find Another Gift
              </Link>
            </div>

            {/* AI PERSONALIZED MESSAGE GENERATOR BOX */}
            <div className="mt-8 p-6 rounded-3xl bg-white border border-giftly-border shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-giftly-lavender flex items-center justify-center text-giftly-purple">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-giftly-dark">
                      AI Personalized Gift Card Note
                    </h3>
                    <p className="text-[11px] text-giftly-muted">
                      Generate a heartfelt or witty note to write on the greeting card.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tone Selectors */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-giftly-muted uppercase tracking-wider">
                  Select Card Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['heartfelt', 'playful', 'poetic', 'witty', 'elegant'] as MessageTone[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                        tone === t
                          ? 'bg-giftly-purple text-white shadow-soft'
                          : 'bg-slate-100 text-giftly-muted hover:text-giftly-dark'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-giftly-muted">Recipient Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Maya"
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs bg-slate-50 border border-giftly-border focus:outline-none focus:border-giftly-purple"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-giftly-muted">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs bg-slate-50 border border-giftly-border focus:outline-none focus:border-giftly-purple font-medium"
                  >
                    <option value="best friend">Best Friend</option>
                    <option value="partner">Partner</option>
                    <option value="sister">Sister</option>
                    <option value="brother">Brother</option>
                    <option value="mother">Mother</option>
                    <option value="colleague">Colleague</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateAI}
                className="w-full py-2.5 rounded-2xl bg-giftly-lavender-light border border-giftly-lavender text-giftly-purple font-bold text-xs hover:bg-giftly-lavender transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-giftly-purple animate-spin-slow" />
                <span>{isGenerating ? 'Drafting Note...' : 'Regenerate Note with AI'}</span>
              </button>

              {/* Rendered Card Note Box */}
              <div className="relative p-4 rounded-2xl bg-slate-50 border border-giftly-border text-xs leading-relaxed font-serif text-giftly-dark whitespace-pre-line">
                {generatedMessage}
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white border border-giftly-border hover:bg-giftly-pink-light text-giftly-dark flex items-center gap-1 text-[11px] font-sans font-bold transition-all shadow-sm"
                  title="Copy message to clipboard"
                >
                  {copiedMessage ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMessage ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
