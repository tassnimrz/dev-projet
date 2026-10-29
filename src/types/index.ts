export type OccasionType = 
  | 'birthday'
  | 'anniversary'
  | 'graduation'
  | 'wedding'
  | 'thank-you'
  | 'spontaneous'
  | 'housewarming'
  | 'holiday';

export type RecipientType = 
  | 'friend'
  | 'best-friend'
  | 'partner'
  | 'parent'
  | 'sibling'
  | 'colleague'
  | 'other';

export type InterestType = 
  | 'photography'
  | 'books'
  | 'beauty'
  | 'fashion'
  | 'technology'
  | 'art'
  | 'travel'
  | 'coffee'
  | 'music'
  | 'nature'
  | 'handmade';

export type BudgetBracket = 
  | 'under-20'
  | '20-50'
  | '50-100'
  | '100-200'
  | 'above-200';

export interface Gift {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  priceTND: number;
  originalPriceTND?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  additionalImages?: string[];
  description: string;
  whyMatches: string;
  wrappingIdea: string;
  sampleCardMessage: string;
  tags: string[];
  compatibleRecipients: RecipientType[];
  compatibleOccasions: OccasionType[];
  budgetBracket: BudgetBracket;
  interests: InterestType[];
  isFeatured?: boolean;
  isPopular?: boolean;
  sellerName?: string;
  isVerifiedSeller?: boolean;
  matchScore?: number;
}

export interface FinderState {
  recipient: RecipientType | null;
  occasion: OccasionType | null;
  interests: InterestType[];
  budget: BudgetBracket | null;
  personalityNotes: string;
  recipientName?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role?: 'admin' | 'user';
  avatarUrl?: string;
  createdAt: string;
}

export interface GeneratedMessageResponse {
  message: string;
  tone: 'heartfelt' | 'playful' | 'poetic' | 'witty' | 'elegant';
}
