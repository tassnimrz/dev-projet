export type MessageTone = 'heartfelt' | 'playful' | 'poetic' | 'witty' | 'elegant';

interface GenerateMessageParams {
  recipientName: string;
  relationship: string;
  occasion: string;
  giftTitle: string;
  tone: MessageTone;
  personalityNotes?: string;
}

export async function generatePersonalizedCardMessage(params: GenerateMessageParams): Promise<string> {
  const { recipientName, relationship, occasion, giftTitle, tone, personalityNotes } = params;
  const name = recipientName.trim() || (relationship ? `my dearest ${relationship}` : 'you');
  const occ = occasion ? occasion.toLowerCase().replace('-', ' ') : 'this special day';

  // Check if a secure backend API endpoint is configured
  const apiEndpoint = import.meta.env.VITE_AI_API_ENDPOINT;

  if (apiEndpoint) {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          return data.message;
        }
      }
    } catch (err) {
      console.warn('Backend AI endpoint unavailable, using GIFTLY intelligent generator fallback:', err);
    }
  }

  // Built-in intelligent generator (works immediately offline or online without API keys)
  // Simulate natural delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 600));

  const noteSnippet = personalityNotes?.trim() 
    ? `Knowing your love for ${personalityNotes.trim().slice(0, 50)}, ` 
    : '';

  switch (tone) {
    case 'heartfelt':
      return `Dearest ${name},\n\nCelebrating your ${occ} is a reminder of how lucky I am to have your warmth, kindness, and light in my life. ${noteSnippet}I chose this ${giftTitle} hoping it brings as much joy to your everyday moments as you bring into mine. Thank you for being you.\n\nWith all my love and gratitude,`;

    case 'playful':
      return `Hey ${name}!\n\nHappy ${occ}! ${noteSnippet}When I saw this ${giftTitle}, I thought of you immediately (and smiled). May this year bring you endless good vibes, spontaneous laughter, and reasons to celebrate. Don't worry—I kept the receipt just in case, but you know you love it!\n\nCheers to you! ✨`;

    case 'poetic':
      return `To ${name},\n\nLike gentle sunlight through Mediterranean olive groves, your presence has an effortless way of bringing grace to the world. On this ${occ}, may this ${giftTitle} serve as a quiet token of moments cherished and memories yet to unfold.\n\nAlways and forever,`;

    case 'witty':
      return `Dear ${name},\n\nHappy ${occ}! They say the best gifts come from the heart, but I decided this ${giftTitle} was a much more stylish option. ${noteSnippet}Please act surprised and admit that I officially win best gift giver of the year.\n\nYours truly,`;

    case 'elegant':
      return `Dear ${name},\n\nWishing you a truly wonderful ${occ} filled with quiet luxury, joy, and celebration. It is an honour to celebrate this milestone with you. May this ${giftTitle} bring timeless beauty and delightful pleasure to your days ahead.\n\nWarmest regards,`;

    default:
      return `Dear ${name},\n\nHappy ${occ}! Thinking of you on this special occasion and hoping this ${giftTitle} brings a bright smile to your day. Enjoy every moment!\n\nWarmly,`;
  }
}
