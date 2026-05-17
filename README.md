# Checkers Coach

Checkers Coach is a web application for learning and practicing checkers. The main idea of the project is to make checkers more beginner-friendly by combining gameplay with simple coaching features and move guidance.

## Main Features

- Fully playable checkers game
- Legal move highlighting
- Mandatory captures and king promotion
- Two "AI" difficulty levels
- Post-game coaching feedback
- Local 2-player mode
- Game history saved in the browser
- Responsive UI for desktop and mobile

## How It Works

The application is divided into separate parts:

- `app/` contains the pages and routing
- `components/` contains reusable UI components
- `lib/checkers.ts` contains the core game logic and rules
- `lib/coach.ts` generates feedback after games
- `lib/storage.ts` handles local game saving

The board rendering and the game logic are separated intentionally so that the rules do not depend on the UI.

The AI system is rule-based:
- Easy AI chooses weaker/random legal moves
- Smart AI evaluates moves using a scoring system that prioritizes captures, king promotion, and positioning

The project does not use a backend or database. All game history is stored locally in the browser using localStorage.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## What I Focused On

Instead of creating only a basic checkers board, I wanted to make the project feel more like a real learning platform.

The main focus was:
- clean and modern UI
- beginner-friendly gameplay
- responsive design
- simple but understandable project structure

I also tried to separate the game logic from the interface to make the project easier to maintain and improve later.

The web app is written in English to make it accessible to a wider audience.

## Running Locally

```bash
npm install
npm run dev
http://localhost:3000