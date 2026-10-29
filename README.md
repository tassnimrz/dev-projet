# 🎁 GIFTLY — Make Every Gift Unforgettable

> A luxurious, playful, feminine gift-discovery web application inspired by premium lifestyle and beauty brands, tailored for authentic surprises priced in **Tunisian Dinars (TND)**.

---

## ✨ Features

- **🌸 Art-Directed Brand Experience**: Custom pastel aesthetic with shades of `#FFFAFC` (canvas), `#F8DCE8` (pastel pink), `#E9DFFF` (lavender), `#7955E8` (electric purple), and `#FFE7D8` (warm peach), paired with typography by Plus Jakarta Sans.
- **✨ 5-Step Interactive Gift Finder**:
  1. **Recipient**: Best friend, partner, parent, sibling, colleague, or someone special.
  2. **Occasion**: Birthdays, romantic anniversaries, graduations, weddings, thank-you tokens, spontaneous surprises.
  3. **Passions**: Photography, books, beauty & skincare, fashion, gadgets, art & design, travel, coffee rituals, acoustics, nature, and Tunisian artisanal crafts.
  4. **Tunisian Dinar (TND) Budget**: Under 20 TND, 20–50 TND, 50–100 TND, 100–200 TND, or Above 200 TND.
  5. **Personality Nuances**: Freeform prompt with instant keyword analysis.
- **🎯 Intelligent Recommendation Engine**: Scored compatibility algorithm that dynamically calculates match percentages (e.g. `98% Match`) and explains *why* the gift aligns with their personality and budget.
- **💎 Dedicated Gift Showcase Pages**:
  - High-resolution editorial photography with gallery thumbnails.
  - Bespoke gift presentation & wrapping ideas.
  - Interactive **AI Greeting Card Generator** with customizable tones (*Heartfelt, Playful, Poetic, Witty, Elegant*).
  - One-click copy note and share gift link.
- **💖 Persistent Favorites**: Synchronized with Supabase PostgreSQL (or local storage fallback), accessible via top navigation with live badge counts.
- **🗄️ Serveur MySQL Réel (Base `giftly_db`)**:
  - Connecté en direct à votre serveur MySQL / MariaDB (port `3306`).
  - Tables relationnelles : `gifts`, `users`, `favorites`.
  - API REST Express complète sur `http://127.0.0.1:5000` proxifiée de manière transparente par Vite sur `/api`.
  - Toutes les données (ajout, modification, suppression, favoris, inscription) sont écrites et lues directement dans MySQL.
- **🔐 Authentication & Dual-Mode Architecture**:
  - **Compte Super-Administrateur**: Accès complet au tableau de bord `/admin` pour gérer le catalogue en temps réel (`admin@giftly.tn` ou bouton **"1-Click Admin"**).
  - **Live MySQL / Supabase Mode**: Persistance en base de données relationnelle sécurisée.
  - **Local Demo Mode**: Repli intelligent hors-ligne si le serveur MySQL est arrêté.
- **🛡️ Tableau de Bord Administrateur (`/admin`)**:
  - Ajout, modification et suppression de cadeaux en direct (CRUD dynamique).
  - Gestion des prix en Dinars Tunisiens (TND), photos, descriptions et idées d'emballage.
  - Statistiques KPI en direct (valeur totale du catalogue, prix moyen, nombre de cadeaux).
  - Exportation du catalogue en JSON et réinitialisation en un clic.
- **📱 Fully Responsive**: Flawless experience across mobile, tablet, and widescreen desktop.

---

## 🛠️ Technology Stack

- **React 18** with **Vite**
- **TypeScript** (strict mode types)
- **Tailwind CSS** (custom brand configuration)
- **Framer Motion & Canvas Confetti** (celebratory animations)
- **React Router 6** (declarative client routing)
- **Lucide React** (modern iconography)
- **React Hook Form & Zod** (validated forms)
- **Supabase JS** (PostgreSQL & user auth)

---

## 🚀 Quick Start & Launch

### 1. Requirements
- Node.js (v18 or v20 LTS recommended)
- npm or yarn

### 2. Installation
```bash
cd C:\Users\HP\tassnim\projet
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase PostgreSQL Setup (Optional)

GIFTLY operates immediately in **Local Demo Mode** without any setup required. To connect your live Supabase project:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard and run this schema:

```sql
-- 1. Create Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create User Favorites table
create table if not exists public.user_favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  gift_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, gift_id)
);

-- 3. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_favorites enable row level security;

create policy "Users can view own profile" 
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

create policy "Users can view own favorites" 
  on public.user_favorites for select using (auth.uid() = user_id);

create policy "Users can insert own favorites" 
  on public.user_favorites for insert with check (auth.uid() = user_id);

create policy "Users can delete own favorites" 
  on public.user_favorites for delete using (auth.uid() = user_id);
```

3. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📦 Project Structure

```
giftly/
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx          # Zod-validated Login/Signup & Demo account
│   │   ├── Footer.tsx             # Brand footer, newsletter & links
│   │   ├── GiftCard.tsx           # Product card with badges, TND price, favs
│   │   ├── Navbar.tsx             # Responsive nav, favorites badge & auth
│   │   ├── SkeletonCard.tsx       # Shimmer loading state
│   │   └── SupabaseModal.tsx      # In-app setup & SQL documentation viewer
│   ├── context/
│   │   ├── AuthContext.tsx        # Auth state (Supabase + localStorage fallback)
│   │   └── FavoritesContext.tsx   # Persistent wishlist management
│   ├── data/
│   │   └── gifts.ts               # 22+ curated gifts with photos & TND prices
│   ├── pages/
│   │   ├── DiscoverPage.tsx       # Full catalog exploration
│   │   ├── FavoritesPage.tsx      # Saved wishlist with empty states
│   │   ├── FinderPage.tsx         # 5-Step interactive wizard with confetti
│   │   ├── GiftDetailPage.tsx     # Full page with wrapping & AI note generator
│   │   ├── HomePage.tsx           # Editorial hero, occasions & collections
│   │   └── ResultsPage.tsx        # Gallery with filter/search/sort toolbar
│   ├── services/
│   │   ├── aiService.ts           # AI & Heuristic message engine (5 tones)
│   │   ├── recommendationEngine.ts# Multi-factor algorithmic matching
│   │   └── supabase.ts            # Client setup & SQL schema export
│   ├── types/
│   │   └── index.ts               # Complete TypeScript interfaces
│   ├── App.tsx                    # Routes & providers
│   ├── index.css                  # Tailwind styles & gradients
│   └── main.tsx                   # React root
├── package.json
├── tailwind.config.js             # Brand palette & typography
├── tsconfig.json
└── vite.config.ts
```

---

*GIFTLY — Designed with ❤️ to make every gift an unforgettable celebration.*
