# ♟️ Checkers Coach

A modern checkers training platform for beginners and kids. Play checkers against an AI or a friend, get legal move hints, and receive personalized coaching feedback after every game.

## Features

- ✅ Full checkers rules (mandatory jumps, multi-jumps, king promotion)
- 💡 Legal move hints — click a piece to see where it can go
- 🤖 Two AI modes: Easy (random) and Smart (strategic)
- 👥 Local 2-player mode
- 🎓 Post-game coach feedback (rule-based, no paid API)
- 📋 Game history saved to localStorage (last 20 games)
- 📱 Responsive, mobile-friendly layout
- 🌙 Dark/light mode toggle

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **localStorage** for game history (no database needed)

## Run Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy on Vercel

```bash
npm install -g vercel
vercel
```

Or: push to GitHub → import on [vercel.com](https://vercel.com) → deploy in 1 click.

## File Structure

```
lib/
  checkers.ts   — All game logic (board, rules, moves)
  ai.ts         — Easy and Smart AI
  storage.ts    — localStorage helpers
  coach.ts      — Post-game tip analysis

components/
  Board.tsx         — 8x8 visual board
  GameSidebar.tsx   — Status, controls, new game
  MoveHistory.tsx   — Saved games list
  CoachModal.tsx    — Post-game coaching modal

app/
  page.tsx          — Landing page
  game/page.tsx     — Main game page
```

## How It Works

Game state lives entirely in React state (`useState`). All move logic is in `lib/checkers.ts` — completely separated from UI. The AI runs synchronously in the browser (no backend). After a game, `lib/coach.ts` re-simulates the moves and generates beginner tips based on simple rules (capture rate, king promotion, game length).

## Limitations

- No online multiplayer (requires WebSocket/server)
- Coach tips are rule-based, not LLM-powered (Pro feature placeholder)
- No user accounts or authentication
