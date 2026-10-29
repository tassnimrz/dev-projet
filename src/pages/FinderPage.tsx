import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  BookOpen, 
  Sparkle, 
  Shirt, 
  Cpu, 
  Palette, 
  Plane, 
  Coffee, 
  Music, 
  Leaf, 
  Hammer,
  Heart,
  Users,
  Briefcase,
  Smile,
  Gift as GiftIcon,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FinderState, RecipientType, OccasionType, InterestType, BudgetBracket } from '../types';

const RECIPIENTS: { id: RecipientType; label: string; desc: string; icon: any }[] = [
  { id: 'best-friend', label: 'Best Friend', desc: 'The one who knows all your secrets', icon: Sparkles },
  { id: 'partner', label: 'Partner / Soulmate', desc: 'For love, warmth & romance', icon: Heart },
  { id: 'friend', label: 'Dear Friend', desc: 'For cherished laughs & connection', icon: Smile },
  { id: 'parent', label: 'Parent / Family Elder', desc: 'To show deep gratitude & honor', icon: Users },
  { id: 'sibling', label: 'Brother or Sister', desc: 'Lifelong partner in crime', icon: GiftIcon },
  { id: 'colleague', label: 'Colleague / Mentor', desc: 'Professional, tasteful & refined', icon: Briefcase },
  { id: 'other', label: 'Someone Special', desc: 'A thoughtful token of appreciation', icon: Sparkle },
];

const OCCASIONS: { id: OccasionType; label: string; subtitle: string }[] = [
  { id: 'birthday', label: 'Birthday Celebration 🎂', subtitle: 'Their special personal milestone' },
  { id: 'anniversary', label: 'Romantic Anniversary 💍', subtitle: 'Honoring love, togetherness & years' },
  { id: 'graduation', label: 'Graduation / Career 🎓', subtitle: 'Degrees, promotions & new chapters' },
  { id: 'wedding', label: 'Wedding or Engagement 💐', subtitle: 'Timeless blessings for couples' },
  { id: 'thank-you', label: 'Heartfelt Thank-You 💌', subtitle: 'Gratitude for someone who helped you' },
  { id: 'spontaneous', label: 'Just Because / Surprise ✨', subtitle: 'No date needed, simply to brighten their day' },
  { id: 'housewarming', label: 'Housewarming 🏡', subtitle: 'Cozy delights for a new home sanctuary' },
  { id: 'holiday', label: 'Festive Holiday 🌟', subtitle: 'Seasonal joy and shared festivities' },
];

const INTERESTS: { id: InterestType; label: string; icon: any }[] = [
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'books', label: 'Books & Reading', icon: BookOpen },
  { id: 'beauty', label: 'Beauty & Skincare', icon: Sparkle },
  { id: 'fashion', label: 'Fashion & Style', icon: Shirt },
  { id: 'technology', label: 'Gadgets & Tech', icon: Cpu },
  { id: 'art', label: 'Art & Design', icon: Palette },
  { id: 'travel', label: 'Travel & Adventure', icon: Plane },
  { id: 'coffee', label: 'Coffee & Tea Rituals', icon: Coffee },
  { id: 'music', label: 'Music & Acoustics', icon: Music },
  { id: 'nature', label: 'Nature & Plants', icon: Leaf },
  { id: 'handmade', label: 'Handcrafted & Heritage', icon: Hammer },
];

const BUDGETS: { id: BudgetBracket; label: string; range: string; desc: string }[] = [
  { id: 'under-20', label: 'Under 20 TND', range: '< 20 DT', desc: 'Sweet, pocket-friendly tokens' },
  { id: '20-50', label: '20 – 50 TND', range: '20 - 50 DT', desc: 'Our most popular sweet spot' },
  { id: '50-100', label: '50 – 100 TND', range: '50 - 100 DT', desc: 'Artisanal elevated gifts' },
  { id: '100-200', label: '100 – 200 TND', range: '100 - 200 DT', desc: 'Special milestones & luxury' },
  { id: 'above-200', label: 'Above 200 TND', range: '200+ DT', desc: 'Statement heirlooms & high-end' },
];

export const FinderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FinderState>({
    recipient: null,
    occasion: null,
    interests: [],
    budget: null,
    personalityNotes: '',
    recipientName: '',
  });

  // Pre-fill occasion from URL if provided
  useEffect(() => {
    const occParam = searchParams.get('occasion') as OccasionType;
    if (occParam && OCCASIONS.some((o) => o.id === occParam)) {
      setFormData((prev) => ({ ...prev, occasion: occParam }));
    }
  }, [searchParams]);

  // Load preserved state from sessionStorage if user previously started
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('giftly_finder_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  // Save to sessionStorage on changes
  const updateState = (updates: Partial<FinderState>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      try {
        sessionStorage.setItem('giftly_finder_state', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleInterest = (interest: InterestType) => {
    const exists = formData.interests.includes(interest);
    const updated = exists
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];
    updateState({ interests: updated });
  };

  const canContinue = () => {
    if (step === 1) return formData.recipient !== null;
    if (step === 2) return formData.occasion !== null;
    if (step === 3) return formData.interests.length > 0;
    if (step === 4) return formData.budget !== null;
    return true; // Step 5 is optional notes
  };

  const handleFinish = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7955E8', '#F8DCE8', '#FFE7D8', '#E9DFFF'],
    });

    // Navigate to results with state
    setTimeout(() => {
      navigate('/results', { state: { finderData: formData } });
    }, 450);
  };

  const progressPercentage = (step / 5) * 100;

  return (
    <div className="pt-28 pb-24 min-h-screen hero-gradient">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Step Indicator Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-giftly-muted">
            <span className="uppercase tracking-widest text-giftly-purple">
              Step {step} of 5
            </span>
            <span>{Math.round(progressPercentage)}% Completed</span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 rounded-full bg-giftly-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-giftly-purple via-pink-400 to-giftly-lavender-dark transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-card border border-giftly-border transition-all duration-300">
          {/* STEP 1: RECIPIENT */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-giftly-purple">
                  Step 1 • The Lucky Person
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-giftly-dark">
                  Who is this special gift for?
                </h2>
                <p className="text-xs sm:text-sm text-giftly-muted">
                  Choose your relationship to help our engine tailor sentiment, tone, and intimacy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {RECIPIENTS.map((rec) => {
                  const Icon = rec.icon;
                  const isSelected = formData.recipient === rec.id;
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => updateState({ recipient: rec.id })}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 ${
                        isSelected
                          ? 'border-giftly-purple bg-giftly-lavender-light ring-2 ring-giftly-purple/20 shadow-soft'
                          : 'border-giftly-border hover:border-giftly-pink hover:bg-giftly-pink-light/40'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-giftly-purple text-white shadow-soft'
                            : 'bg-white text-giftly-purple border border-giftly-border'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-giftly-dark">{rec.label}</p>
                          {isSelected && <Check className="w-4 h-4 text-giftly-purple" />}
                        </div>
                        <p className="text-[11px] text-giftly-muted mt-0.5 line-clamp-1">
                          {rec.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: OCCASION */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-giftly-purple">
                  Step 2 • The Moment
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-giftly-dark">
                  What occasion are you celebrating?
                </h2>
                <p className="text-xs sm:text-sm text-giftly-muted">
                  From major life triumphs to sweet everyday gestures.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {OCCASIONS.map((occ) => {
                  const isSelected = formData.occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => updateState({ occasion: occ.id })}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? 'border-giftly-purple bg-giftly-lavender-light ring-2 ring-giftly-purple/20 shadow-soft'
                          : 'border-giftly-border hover:border-giftly-pink hover:bg-giftly-pink-light/40'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm text-giftly-dark">{occ.label}</p>
                        <p className="text-[11px] text-giftly-muted mt-0.5">{occ.subtitle}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-giftly-purple text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: INTERESTS */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-giftly-purple">
                    Step 3 • Their Passions
                  </span>
                  <span className="text-xs font-bold text-giftly-purple">
                    {formData.interests.length} Selected
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-giftly-dark">
                  What lights up their world?
                </h2>
                <p className="text-xs sm:text-sm text-giftly-muted">
                  Pick one or more interests that match their hobbies, lifestyle, or daily delights.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {INTERESTS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between aspect-[1.1] transition-all duration-200 ${
                        isSelected
                          ? 'border-giftly-purple bg-gradient-to-br from-giftly-lavender-light to-giftly-pink-light ring-2 ring-giftly-purple/30 shadow-soft scale-[1.02]'
                          : 'border-giftly-border hover:border-giftly-purple/40 hover:bg-white bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-giftly-purple text-white'
                              : 'bg-white text-giftly-dark border border-giftly-border'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-giftly-purple text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-giftly-dark mt-2">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: BUDGET */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-giftly-purple">
                  Step 4 • Your Investment
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-giftly-dark">
                  Choose a budget in Tunisian Dinars
                </h2>
                <p className="text-xs sm:text-sm text-giftly-muted">
                  All prices are calibrated in authentic Tunisian Dinars (TND) from local and specialty artisans.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {BUDGETS.map((b) => {
                  const isSelected = formData.budget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => updateState({ budget: b.id })}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                        isSelected
                          ? 'border-giftly-purple bg-giftly-lavender-light ring-2 ring-giftly-purple/20 shadow-soft'
                          : 'border-giftly-border hover:border-giftly-pink hover:bg-giftly-pink-light/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-base text-giftly-dark">
                            {b.label}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-giftly-purple border border-giftly-purple/20">
                            {b.range}
                          </span>
                        </div>
                        <p className="text-[11px] text-giftly-muted mt-0.5">{b.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-giftly-purple text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: PERSONALITY & NOTES */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-giftly-purple">
                  Step 5 • The Personal Touch (Optional)
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-giftly-dark">
                  What makes them truly special?
                </h2>
                <p className="text-xs sm:text-sm text-giftly-muted">
                  Add their name or describe their quirks, favorite colors, aesthetics, or memorable moments.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-giftly-dark mb-1">
                    Recipient's Name or Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName || ''}
                    onChange={(e) => updateState({ recipientName: e.target.value })}
                    placeholder="e.g. Yasmine, Adam, Mama..."
                    className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-giftly-dark mb-1">
                    Describe their personality & style
                  </label>
                  <textarea
                    rows={4}
                    value={formData.personalityNotes}
                    onChange={(e) => updateState({ personalityNotes: e.target.value })}
                    placeholder="e.g. She loves slow morning pour-over coffee, vintage cameras, pastel floral journals, and hates generic plastic items..."
                    className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 border border-giftly-border focus:bg-white focus:border-giftly-purple focus:outline-none transition-all leading-relaxed"
                  />
                  <p className="text-[11px] text-giftly-muted mt-1">
                    Our recommendation algorithm scans your notes for semantic clues and boosts compatible items!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls Footer */}
          <div className="mt-10 pt-6 border-t border-giftly-border flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-giftly-border text-giftly-dark hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 5 ? (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() => setStep(step + 1)}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs transition-all shadow-soft ${
                  canContinue()
                    ? 'bg-giftly-purple text-white hover:bg-giftly-purple-hover hover:scale-105 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-giftly-purple to-giftly-lavender-dark text-white font-bold text-xs sm:text-sm shadow-hover hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-giftly-peach" />
                <span>Discover Perfect Gifts</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
