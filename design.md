# Student Budget Manager — Design Document

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth & DB | Supabase (email/password auth + PostgreSQL) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Animation | Motion.js (`npm install motion`) |
| Deployment | Vercel (recommended) |

---

## Design Philosophy

**Gamified + Mobile-First.** The app should feel like a game, not a spreadsheet. Students are motivated by streaks, progress bars, levels, and instant visual feedback. Every interaction should feel rewarding — saving an expense triggers a satisfying animation, a streak feels like an achievement, and the balance card feels like a health bar.

**Mobile-first** means design for 390px width (iPhone 14) first. No horizontal scrolling. Tap targets minimum 44px. Bottom-aligned primary actions. Single column always.

---

## Design System

### Typography

- **Font:** `Space Grotesk` — modern, slightly rounded, feels alive. Perfect for numbers and game UI.
- Import via `next/font/google`, weight `['400', '500', '600', '700']`

**Font Scale:**

| Use | Class |
|---|---|
| Page title | `text-2xl font-bold` |
| Section header | `text-lg font-semibold` |
| Body / label | `text-sm font-medium` |
| Helper / sub-text | `text-xs text-muted-foreground` |
| Balance hero number | `text-5xl font-bold tracking-tight` |
| XP / streak badge | `text-xs font-bold uppercase tracking-widest` |

---

### Color Palette

Dark-card gamified theme on a light background. The hero BalanceCard uses a deep dark surface to make it feel like a game HUD. All other cards are white.

| Role | Tailwind Class | Hex |
|---|---|---|
| Page background | `bg-slate-50` | `#f8fafc` |
| Hero card (dark) | `bg-slate-900` | `#0f172a` |
| Surface card | `bg-white` | `#ffffff` |
| Card border | `border-slate-200` | `#e2e8f0` |
| Income / balance | `text-emerald-400` (on dark) / `text-emerald-600` (on light) | `#34d399` / `#059669` |
| Expenses | `text-red-400` (on dark) / `text-red-500` (on light) | `#f87171` / `#ef4444` |
| Streak / XP accent | `text-amber-400` / `bg-amber-400` | `#fbbf24` |
| Level badge | `bg-violet-500` | `#8b5cf6` |
| Primary CTA | `bg-emerald-500 text-white` | `#10b981` |
| Expense CTA | `bg-red-500 text-white` | `#ef4444` |
| Text on dark card | `text-slate-100` / `text-slate-400` (muted) | — |
| Text on light card | `text-slate-800` / `text-slate-500` (muted) | — |

> **Rule:** Balance and income amounts → always `emerald`. Expense amounts → always `red`. Streak/XP/level elements → always `amber` or `violet`.

---

### Spacing & Layout (Mobile-First)

- **Target viewport:** 390px wide × 844px tall (iPhone 14)
- **Max content width:** `max-w-[430px] mx-auto` — never wider than a large phone
- **Page padding:** `px-4 pt-4 pb-24` — bottom padding reserves space for the fixed bottom nav
- **Card padding:** `p-4` or `p-5`
- **Gap between sections:** `space-y-3`
- **Tap targets:** All buttons and interactive items minimum `h-11` (44px)
- **Bottom nav height:** `h-16` + iOS safe area inset

### Border Radius & Shadows

All corners are heavily rounded for a friendly game-card feel:
- Cards: `rounded-2xl`
- Buttons: `rounded-xl`
- Chips / badges: `rounded-full`
- Inputs: `rounded-xl`

Shadows: `shadow-sm` on regular cards, `shadow-lg` on the hero BalanceCard.

---

## Gamification Elements

### Streak System
- Fire badge on dashboard: `"🔥 3 Day Streak — Keep it up!"`
- Style: `bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-4 py-3 text-sm font-semibold`
- Animate on mount with a scale spring bounce (Motion.js)
- On `/summary`: show Mon–Sun dot indicators with staggered entrance animation

### XP System (localStorage only — no backend)
- +10 XP per expense saved, +5 XP per income saved
- Store in `localStorage` via `useXP` hook
- After each save: a `+10 XP ⚡` label floats up from the button and fades out
- Dashboard shows: `⚡ 240 XP` in a small amber badge

### Level Badge (derived from XP)
- `level = Math.floor(xp / 100) + 1`
- Show on dashboard header: `Lv. 3` — `bg-violet-500 text-white text-xs font-bold rounded-full px-2 py-1`
- Animate level-up with a `scale` pop

### Budget Health Bar
- Visual progress bar on the BalanceCard showing days consumed vs total budget days
- Color: green (>50% remaining) → amber (25–50%) → red (<25%)
- Animated width fill on mount using Motion.js

### Category Emoji Icons

| Category | Emoji |
|---|---|
| Food | 🍔 |
| Transport | 🚌 |
| Data | 📶 |
| School | 📚 |
| Airtime | 📱 |
| Personal | 👤 |
| Other | 📦 |
| Allowance | 💰 |
| Gift | 🎁 |
| Work | 💼 |

---

## Motion.js Animation Spec

Install: `npm install motion`

Import:
```ts
import { motion, AnimatePresence } from 'motion/react'
```

### Page Transitions
Every page wraps content in a `<motion.div>` slide-up + fade-in. Create a reusable `<PageTransition>` component:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {children}
</motion.div>
```
Wrap the root layout's page slot in `<AnimatePresence mode="wait">`.

### Balance Count-Up
On dashboard load, the balance number counts from 0 to the actual value:
```ts
import { animate, useMotionValue, useTransform } from 'motion/react'
// On mount: animate(motionValue, targetBalance, { duration: 0.8, ease: 'easeOut' })
// Render: motionValue.get().toFixed(0) formatted with ₦
```

### Staggered Transaction List
```tsx
// Parent ul
<motion.ul
  variants={{ show: { transition: { staggerChildren: 0.06 } } }}
  initial="hidden"
  animate="show"
>
// Each li child
<motion.li
  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
>
```

### XP Float Toast
A `+10 XP ⚡` label animates upward and fades after saving:
```tsx
<motion.div
  initial={{ opacity: 1, y: 0, scale: 1 }}
  animate={{ opacity: 0, y: -48, scale: 1.2 }}
  transition={{ duration: 0.7, ease: 'easeOut' }}
  className="absolute text-amber-500 font-bold text-sm pointer-events-none"
>
  +10 XP ⚡
</motion.div>
```

### Streak Badge Bounce
```tsx
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
>
  🔥 3 Day Streak
</motion.div>
```

### Animated Progress Bar
```tsx
<motion.div
  className="h-2 rounded-full bg-emerald-500"
  initial={{ width: 0 }}
  animate={{ width: `${percent}%` }}
  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
/>
```

### Button Tap Feedback
All primary buttons and tappable cards:
```tsx
<motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
```

### Bottom Nav Active Dot
Use `layoutId` for a smooth sliding indicator:
```tsx
{isActive && (
  <motion.div
    layoutId="nav-dot"
    className="absolute bottom-1 h-1 w-5 bg-emerald-500 rounded-full"
  />
)}
```

### AnimatePresence for List Deletions
Wrap list items so removed items animate out:
```tsx
<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id} exit={{ opacity: 0, height: 0, marginBottom: 0 }}>
```

---

## Database Schema (Supabase)

```sql
-- Auto-populated on signup via trigger
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Trigger to create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

create table income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  source text,               -- 'Allowance' | 'Gift' | 'Work' | 'Other'
  date date not null default current_date,
  created_at timestamptz default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  category text not null,    -- 'Food' | 'Transport' | 'Data' | 'School' | 'Airtime' | 'Personal' | 'Other'
  date date not null default current_date,
  note text,
  created_at timestamptz default now()
);
```

Enable Row Level Security. Policy for all three tables: `user_id = auth.uid()`.

---

## App Flow (Auth → Finish)

```
/                        → redirect to /dashboard if session, else /login
/login                   → Login
/signup                  → Signup
/onboarding              → 2-step budget setup (first time only)
/dashboard               → Home: balance, streaks, quick actions
/income/add              → Add income
/income/[id]/edit        → Edit/delete income
/expenses/add            → Add expense
/expenses/[id]/edit      → Edit/delete expense
/history                 → Full transaction list grouped by date
/summary                 → Weekly category breakdown + streak
```

---

## Screen-by-Screen Spec

### 1. `/login` — Login

**Layout:** Full-height, vertically centered, `px-6`

**Elements:**
- Logo emoji `💰` in `bg-emerald-100 rounded-2xl p-4 text-5xl w-fit mx-auto` — animate in with scale spring
- App name: `text-3xl font-bold text-center`
- Tagline: `"Level up your finances 🚀"` — `text-slate-500 text-sm text-center`
- Email + Password inputs (shadcn, `rounded-xl`)
- `<motion.button whileTap={{ scale: 0.97 }} className="w-full h-12 bg-emerald-500 text-white rounded-xl font-semibold">` — "Log In"
- Link to `/signup`

---

### 2. `/signup` — Signup

Same layout as login. Fields: Name, Email, Password. On success → `/onboarding`.

---

### 3. `/onboarding` — Budget Setup (2 animated steps)

**Step 1:** Welcome
- `"Welcome, [Name]! 👋"` — `text-2xl font-bold`
- `"Let's set your budget period"` — sub-text
- CTA: `"Let's Go →"` — `bg-emerald-500 w-full h-12 rounded-xl`

**Step 2:** Dates
- `"When does your money need to last?"` — heading
- Start Date + End Date inputs
- `"Get Started 🎯"` button

Transition between steps: `AnimatePresence` with `x` slide (step 1 exits left, step 2 enters from right).
Progress dots at bottom: `● ○` → `● ●` with Motion.js `layoutId` animation.

---

### 4. `/dashboard` — Home Screen

**Header Row:**
- Left: `"Hey, [Name] 👋"` `text-lg font-semibold` + date `text-xs text-slate-400`
- Right: `Lv. 3` violet pill + `⚡ 240` amber text — both animate in on mount

**Streak Banner** (if streak ≥ 1):
- `"🔥 3 Day Streak — Keep it up!"` — amber card, scale bounce on mount

**Balance Hero Card** (`bg-slate-900 rounded-2xl p-5 shadow-lg`):
```
Available Balance       [dark card]
₦8,500                  ← text-5xl font-bold text-emerald-400 (count-up)
────────────────────────
[Health bar: green/amber/red animated fill]
12 days left  ·  You can spend ₦600/day
```

**Stats Row** (`grid grid-cols-2 gap-3`):
- Income: white card, `📈`, `text-emerald-600 font-bold`
- Expenses: white card, `📉`, `text-red-500 font-bold`
- Stagger in with 0.1s delay between cards

**Quick Actions** (`grid grid-cols-2 gap-3`):
- `bg-emerald-500 text-white h-12 rounded-xl` — `"+ Income"` → `/income/add`
- `bg-red-500 text-white h-12 rounded-xl` — `"+ Expense"` → `/expenses/add`
- Both: `whileTap={{ scale: 0.95 }}`

**Recent Transactions:**
- `"Recent 📋"` heading + `"See all →"` right link
- Last 5, staggered list
- Row: emoji + category + note left, amount right, date sub-text

**Bottom Nav** (fixed):
- Icons: 🏠 Home · 📋 History · 📊 Summary · 👤 Profile
- Active: green animated dot using `layoutId="nav-dot"`
- `pb-[env(safe-area-inset-bottom)]` for iOS

---

### 5. `/income/add` and `/income/[id]/edit`

**Layout:** Slides up from bottom (y: 100% → 0) giving a bottom-sheet feel

**Elements:**
- Drag handle: `w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6`
- Title: `"Add Income 💰"`
- Amount input: centered, `text-5xl font-bold text-emerald-500`, no visible border, placeholder `"₦0"` — feels native calculator-like
- Source chip row (horizontal scroll, no dropdown): `Allowance 💰` `Gift 🎁` `Work 💼` `Other 📦`
  - Selected: `bg-emerald-500 text-white rounded-full px-4 py-2`
  - Unselected: `bg-slate-100 text-slate-600 rounded-full px-4 py-2`
  - Tap selection: `whileTap={{ scale: 0.92 }}` + `animate` background color
- Date input
- `"Save Income"` button — `bg-emerald-500 w-full h-12 rounded-xl`
- After save: XP float animation, success toast, pop back
- Edit only: `"Delete"` button `bg-red-50 text-red-500 border border-red-200 w-full h-11 rounded-xl`

---

### 6. `/expenses/add` and `/expenses/[id]/edit`

Same bottom-sheet feel as income.

**Amount:** `text-5xl font-bold text-red-500`

**Category chips** (2-row wrap grid, 4 per row):
`🍔 Food` `🚌 Transport` `📶 Data` `📚 School` `📱 Airtime` `👤 Personal` `📦 Other`
- Selected: `bg-red-500 text-white`
- Tap: `whileTap={{ scale: 0.92 }}`

Note input, Date, `"Save Expense"` `bg-red-500 w-full h-12 rounded-xl`.

---

### 7. `/history` — Transaction History

**Tabs:** `All` · `Expenses` · `Income` (shadcn Tabs)

**Grouped by date:**
```
Today
  🍔 Food · Lunch                -₦500
  🚌 Transport                   -₦300

Yesterday
  📶 Data                       -₦1,000
```
- Date group header: `text-xs text-slate-400 uppercase tracking-wider font-semibold pt-3 pb-1`
- Each row is `whileTap={{ scale: 0.98 }}`, tapping navigates to edit
- `AnimatePresence` so deletions animate out (height collapses to 0)

---

### 8. `/summary` — Weekly Summary

**Streak Card:**
```
bg-amber-50 border border-amber-200 rounded-2xl p-4
🔥 3 Day Streak
Mon ● Tue ● Wed ● Thu ○ Fri ○ Sat ○ Sun ○
```
- Dots: filled = `bg-amber-400 rounded-full w-3 h-3`, empty = `bg-slate-200`
- Stagger dots in with 0.08s per dot

**Category Bars:**
```
🍔 Food          ₦3,000  ████████░░  60%
🚌 Transport     ₦1,200  ████░░░░░░  24%
```
- Each bar: `bg-slate-100 rounded-full h-2` track, `motion.div` animated fill
- Fill color matches category feel (or just use `bg-emerald-500` uniformly)

**XP Progress:**
```
⚡ 240 XP · Level 3
[=========>--------] 40 XP to Level 4
```
- Animated bar on mount

---

## Component Breakdown

```
/components
  /ui                      ← shadcn auto-generated
  /motion
    PageTransition.tsx     ← slide-up wrapper for every page
    FadeIn.tsx             ← simple opacity + y fade
    StaggerList.tsx        ← ul with staggerChildren
    XPToast.tsx            ← floating +XP animation
    CountUp.tsx            ← animated number count-up using motion values
  BalanceCard.tsx          ← dark hero card with count-up + health bar
  StatCard.tsx             ← income / expense summary card
  BudgetHealthBar.tsx      ← animated progress bar with color transitions
  TransactionItem.tsx      ← single row with emoji + amount
  TransactionList.tsx      ← staggered grouped list
  CategoryChips.tsx        ← pill tap-selector for expense categories
  SourceChips.tsx          ← pill tap-selector for income sources
  AmountInput.tsx          ← large centered native-feel amount input
  StreakCard.tsx            ← amber banner + dot indicators
  StreakDots.tsx           ← Mon–Sun dots with stagger animation
  LevelBadge.tsx           ← violet Lv. N pill
  XPBadge.tsx              ← amber ⚡ XP display
  BottomNav.tsx            ← fixed nav with layoutId active dot
  WeeklyCategoryBar.tsx    ← animated category progress row
```

---

## Supabase Auth Config

- Provider: **Email** only
- After `signUp()` → check if budget row exists → if not, redirect to `/onboarding`
- Use `supabase.auth.onAuthStateChange` in root layout provider to manage session client-side
- Middleware (`middleware.ts`): protect all routes except `/login`, `/signup`

---

## Key Calculations (Client-side)

```ts
balance = totalIncome - totalExpenses
daysLeft = differenceInDays(budget.end_date, today)
dailyAllowance = balance / daysLeft
budgetPercent = (daysLeft / totalBudgetDays) * 100   // health bar

// XP (localStorage only)
xp = localStorage.getItem('xp') ?? 0
level = Math.floor(xp / 100) + 1
xpToNextLevel = (level * 100) - xp
```

---

## File Structure

```
/app
  layout.tsx                  ← Root layout: Space Grotesk font, AuthProvider, AnimatePresence
  page.tsx                    ← Redirect logic
  /login/page.tsx
  /signup/page.tsx
  /onboarding/page.tsx
  /dashboard/page.tsx
  /income
    /add/page.tsx
    /[id]/edit/page.tsx
  /expenses
    /add/page.tsx
    /[id]/edit/page.tsx
  /history/page.tsx
  /summary/page.tsx
/components/...
/lib
  supabase.ts                 ← createClient (browser + server helpers)
  calculations.ts             ← balance, dailyAllowance, daysLeft
  categoryConfig.ts           ← { Food: { emoji: '🍔', color: 'red' }, ... }
/hooks
  useBudget.ts
  useTransactions.ts
  useXP.ts                    ← localStorage XP + streak read/write
```

---

## Implementation Order for Claude Code

1. **Project setup** — `create-next-app`, install `motion`, shadcn init, configure Supabase env vars, add `Space_Grotesk` font
2. **Supabase schema** — run SQL, enable RLS, add policies
3. **Auth pages** — `/login` + `/signup` with logo bounce, page slide-in
4. **Middleware** — protect all routes except auth pages
5. **Onboarding** — 2-step animated flow, save to `budgets`
6. **Root layout** — `BottomNav`, `PageTransition` wrapper, `AnimatePresence`
7. **Dashboard** — BalanceCard (count-up + health bar), StatCards (stagger), streak badge, quick action buttons
8. **Add/Edit Income** — bottom-sheet slide, chip selector, XP toast on save
9. **Add/Edit Expense** — same pattern, category chips
10. **History page** — date-grouped list, `AnimatePresence` on items
11. **Summary page** — animated category bars, streak dots, XP progress bar
12. **XP/Level system** — wire `useXP` across all save actions, level-up pop animation
13. **Polish** — loading skeletons, empty states, safe-area insets, error toasts