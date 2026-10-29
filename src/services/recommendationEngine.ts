import { Gift, FinderState, BudgetBracket } from '../types';
import { SAMPLE_GIFTS } from '../data/gifts';

const BUDGET_RANGES: Record<BudgetBracket, { min: number; max: number }> = {
  'under-20': { min: 0, max: 20 },
  '20-50': { min: 20, max: 50 },
  '50-100': { min: 50, max: 100 },
  '100-200': { min: 100, max: 200 },
  'above-200': { min: 200, max: 9999 },
};

export function getBudgetLabel(bracket: BudgetBracket | null): string {
  switch (bracket) {
    case 'under-20':
      return 'Under 20 TND';
    case '20-50':
      return '20 – 50 TND';
    case '50-100':
      return '50 – 100 TND';
    case '100-200':
      return '100 – 200 TND';
    case 'above-200':
      return 'Above 200 TND';
    default:
      return 'All Budgets';
  }
}

export function rankGifts(state: FinderState, allGifts: Gift[] = SAMPLE_GIFTS): Gift[] {
  const scored = allGifts.map((gift) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Recipient Match (up to 25 pts)
    if (state.recipient) {
      if (gift.compatibleRecipients.includes(state.recipient)) {
        score += 25;
        reasons.push(`ideal for your ${state.recipient.replace('-', ' ')}`);
      } else {
        score += 8;
      }
    } else {
      score += 15;
    }

    // 2. Occasion Match (up to 25 pts)
    if (state.occasion) {
      if (gift.compatibleOccasions.includes(state.occasion)) {
        score += 25;
        reasons.push(`celebrates their ${state.occasion.replace('-', ' ')} perfectly`);
      } else {
        score += 8;
      }
    } else {
      score += 15;
    }

    // 3. Interests Match (up to 30 pts)
    if (state.interests && state.interests.length > 0) {
      const matchingInterests = gift.interests.filter((item) =>
        state.interests.includes(item)
      );
      if (matchingInterests.length > 0) {
        const ratio = matchingInterests.length / state.interests.length;
        const interestPoints = Math.min(30, Math.round(ratio * 30 + matchingInterests.length * 6));
        score += interestPoints;
        reasons.push(`matches passion for ${matchingInterests.join(' & ')}`);
      } else {
        score += 4;
      }
    } else {
      score += 15;
    }

    // 4. Budget Match (up to 20 pts)
    if (state.budget) {
      const target = BUDGET_RANGES[state.budget];
      if (gift.priceTND >= target.min && gift.priceTND <= target.max) {
        score += 20;
        reasons.push(`fits within ${getBudgetLabel(state.budget)}`);
      } else {
        // Adjacent bracket check
        const dist = Math.min(
          Math.abs(gift.priceTND - target.min),
          Math.abs(gift.priceTND - target.max)
        );
        if (dist <= 35) {
          score += 10;
        } else {
          score += 2;
        }
      }
    } else {
      score += 15;
    }

    // 5. Personality Notes Keyword Scan (up to 15 bonus pts)
    if (state.personalityNotes && state.personalityNotes.trim().length > 0) {
      const notesLower = state.personalityNotes.toLowerCase();
      const searchable = `${gift.title} ${gift.subtitle} ${gift.description} ${gift.tags.join(' ')}`.toLowerCase();
      
      const keywords = notesLower
        .split(/[\s,.;!?]+/)
        .filter((w) => w.length > 3 && !['with', 'they', 'like', 'love', 'very', 'have', 'them', 'that', 'this'].includes(w));

      let matchedKeywords = 0;
      keywords.forEach((kw) => {
        if (searchable.includes(kw)) {
          matchedKeywords++;
        }
      });

      if (matchedKeywords > 0) {
        const bonus = Math.min(15, matchedKeywords * 5);
        score += bonus;
        reasons.push('aligns with your personality description');
      }
    }

    // Convert raw score (max around 115) to a clean 75% - 99% match scale
    const percentage = Math.min(99, Math.max(72, Math.round((score / 115) * 35 + 64)));

    // Generate tailored "why matches" sentence if options were picked
    let dynamicWhyMatches = gift.whyMatches;
    if (reasons.length > 0) {
      dynamicWhyMatches = `Curated because it ${reasons.join(', and ')}.`;
    }

    return {
      ...gift,
      matchScore: percentage,
      whyMatches: dynamicWhyMatches,
    };
  });

  // Sort by highest matchScore, then by rating
  return scored.sort((a, b) => {
    if ((b.matchScore || 0) !== (a.matchScore || 0)) {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    return b.rating - a.rating;
  });
}
