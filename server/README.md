# Nota — client

React + Vite + Tailwind (v4) + Clerk client.

## Setup

```bash
npm install
```

Create `.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

The dev server proxies `/api/*` to `http://localhost:5000` (see
`vite.config.ts`) — point that at wherever the Express server runs.

## Assets

Code references these as `/assets/<name>` (served directly from
`public/assets/`, no import needed):

- `public/assets/logo.png`
- `public/assets/bass-cleff.png`
- `public/assets/many-notes.jpg`
- `public/assets/cello.jpg`
- `public/assets/profile-placeholder.png`

Export each from the Figma file (`fileKey: HbNqBpVGcd4gzjfp7xbWhE`) at 2x.

## Auth

Clerk, with custom single-screen forms (`pages/Login.tsx`,
`pages/Signup.tsx`) built on `useSignIn`/`useSignUp` rather than Clerk's
prebuilt `<SignIn>`/`<SignUp>` components — those showed a two-step
identify-then-password flow that didn't match the Figma design.

## The level system

Two explanation depths — `beginner` and `seasoned` — matching the
proposal's layman/expert tracks (`context/LevelContext.tsx`). The third
tab visible on the piece page, "Interpretations", is NOT a third depth —
it navigates to `pages/Compare.tsx` instead.

## Sync engine wiring

`pages/PieceDetail.tsx` embeds a real YouTube IFrame Player
(`hooks/useYouTubePlayer.ts`) and calls
`pieces.service.getAnnotationAtTime()` on every 1s tick with the live
timestamp — this is the actual client-side half of the sync engine.

