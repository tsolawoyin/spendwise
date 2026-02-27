# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SpendWise is a mobile-first gamified personal finance tracker for students, built with Next.js 16 (App Router), Supabase (auth + PostgreSQL), and TypeScript. The full design specification lives in `design.md`.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Start production:** `npm run start`
- **Lint:** `npm run lint`
- **Add shadcn component:** `npx shadcn@latest add <component>`

## Architecture

### Stack

- **Next.js 16** with App Router and React Compiler enabled (`next.config.ts`)
- **React 19** with strict TypeScript
- **Supabase** for auth and database (SSR integration via `@supabase/ssr`)
- **Tailwind CSS 4** (configured via `@tailwindcss/postcss` in `postcss.config.mjs`, theme variables in `globals.css`)
- **shadcn/ui** (new-york style, config in `components.json`)
- **Motion.js** for animations
- **web-push** for PWA push notifications

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

### Supabase Client Variants (`src/lib/supabase/`)

- `client.ts` — Browser-side client for "use client" components
- `server.ts` — Server-side client for Server Components and Server Actions (manages cookies)
- `admin.ts` — Privileged client using `SUPABASE_SERVICE_KEY` (server-only)
- `middleware.ts` — Edge middleware for route protection (currently protects `/profile/me`)

### Providers (`src/providers/`)

- **AppProvider** (`app-provider.tsx`): Wraps app with `AppContext` providing `{ supabase, user, setUser }`. Access via `useApp()` hook. Also renders the Sonner `<Toaster />`.
- **PushNotificationProvider** (`push-notification-context.tsx`): Manages service worker registration and push subscription lifecycle. Access via `usePushNotification()` hook.

### Root Layout Flow (`src/app/layout.tsx`)

`ThemeProvider` → `AppProvider` (fetches user server-side from Supabase `profiles` table) → page content. Font: Karla.

### Push Notifications

- Service worker at `public/sw.js` (network-first fetch strategy, push event handling)
- Server actions in `src/utils/notification-actions.ts` (`subscribeUser`, `unsubscribeUser`, `sendNotification`, `notifyAdmins`, `createNotification`)
- VAPID keys configured via env vars

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_KEY`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

## Design Conventions

- **Mobile-first:** Target 390px viewport, max content width `max-w-[430px] mx-auto`
- **Tap targets:** Minimum 44px (`h-11`)
- **Color semantics:** Emerald for income/balance, red for expenses, amber for streaks/XP, violet for level badges
- **Dark hero card:** `bg-slate-900` for balance display
- **Category emojis** are used for expense categories (see `design.md` for full list)

## Database Schema (Supabase)

Four tables: `profiles`, `budgets`, `income`, `expenses`. All linked by `user_id` (UUID FK to `auth.users`). Full schema in `design.md`.
