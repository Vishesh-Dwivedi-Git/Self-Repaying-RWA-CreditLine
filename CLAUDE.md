# CLAUDE.md - Odyssée RWA Credit Line Frontend

## Project Overview

**Odyssée** is a Mantle-native DeFi lending protocol that automatically harvests yield from collateral (mETH, fBTC) and applies it to loan repayment. Users deposit yield-bearing assets, borrow stablecoins, and watch their debt reduce automatically.

**Vision**: Transform DeFi lending from an active burden into a passive wealth-building tool.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| Animation | Framer Motion, Lenis, GSAP | Latest |
| Web3 | Wagmi + Viem | Latest |
| Icons | Lucide React | Latest |

---

## Directory Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles, Tailwind theme, custom scrollbar
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Landing page (Hero, RWA, Security, Builder, Footer)
│   ├── components/
│   │   ├── Navbar.tsx           # Floating "Command Island" navigation
│   │   ├── HeroFlow.tsx         # Hero section with 3D visuals
│   │   ├── RWAIntelligence.tsx  # Bento Grid feature cards
│   │   ├── Footer.tsx           # Site footer
│   │   ├── ConnectWalletButton.tsx # Web3 wallet connection
│   │   ├── landing/
│   │   │   ├── SecurityFeature.tsx   # Protocol security showcase
│   │   │   ├── BuilderGrid.tsx       # Use case cards
│   │   │   └── TransparencySection.tsx # Partner logos, live feed
│   │   └── ui/
│   │       ├── Button.tsx        # Base button component
│   │       ├── SmoothScroll.tsx  # Lenis smooth scroll wrapper
│   │       └── ScrollReveal.tsx  # Blur-in scroll animation
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   └── utils.ts              # cn() helper (clsx + tailwind-merge)
│   ├── providers/                # Context providers (Wagmi, Theme)
│   └── types/                    # TypeScript type definitions
├── public/                       # Static assets
├── PRD.md                        # Product Requirements Document
└── package.json
```

---

## Design System

### Color Palette
- **Background**: `#030303`, `#050505`, `#0a0a0a` (Obsidian blacks)
- **Accent**: Emerald (`#10b981`) for positive states, Blue (`#3b82f6`) for info
- **Text**: White, `gray-400`, `gray-500` for hierarchy

### Typography
- **Display Font**: `Outfit` (`font-display`)
- **Body Font**: `Manrope` (`font-sans`)
- **Sizing**: Large headlines (`text-6xl md:text-7xl`), tight `tracking-tighter`

### Layout
- **Max Width**: `max-w-7xl` (~1280px)
- **Padding**: `px-4 md:px-6 lg:px-8` (responsive gutters)
- **Vertical Rhythm**: `py-24 md:py-40` (sections)

### UI Components
- **Glass Panels**: `bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10`
- **Cards**: `rounded-2xl` or `rounded-[2rem]`, `hover:border-white/20`
- **Buttons**: `rounded-full`, white bg with black text for CTA

---

## Animation Conventions

1. **Scroll Reveal**: Use `<ScrollReveal>` wrapper for elements entering viewport
   - Props: `delay`, `duration`, `width`
   - Effect: Blur-to-focus + fade-in

2. **Smooth Scroll**: Global `<SmoothScroll />` in layout.tsx (Lenis)

3. **Framer Motion**: Use for complex animations
   - `whileInView`, `viewport={{ once: true }}`
   - Custom easing: `[0.16, 1, 0.3, 1]`

---

## Key Business Logic

### Core Protocol Mechanics
- **Max LTV**: 70%
- **Liquidation Threshold**: 80%
- **Yield Split**: 85% user / 15% protocol
- **Supported Collateral**: mETH, fBTC

### User Flow
1. Connect Wallet
2. Select Collateral (mETH or fBTC)
3. Enter deposit amount, choose borrow amount
4. Review terms (LTV, Health Factor, Auto-repay timeline)
5. Confirm transaction
6. Loan is active, yield auto-repays debt

---

## Environment Variables

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=   # Required for WalletConnect
```

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

---

## Important Context for AI

1. **Design Philosophy**: "Advent Grade Ultra Premium" — high-end, glassmorphic, cinematic. Avoid generic bootstrap looks.

2. **Tailwind v4**: Uses `@import "tailwindcss"` and `@theme` directive. Some CSS lints may show due to new syntax.

3. **Mobile First**: All sections must be responsive with equal left/right gutters.

4. **Floating Navbar**: The navbar is a detached "Command Island" that floats from the top, not a traditional fixed header.

5. **No Placeholders**: Use real data or generate assets. Avoid lorem ipsum or placeholder images.

6. **PRD Alignment**: All content should align with `PRD.md` — target users, use cases, and protocol mechanics.
