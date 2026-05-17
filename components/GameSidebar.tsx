"use client";

import { GameState, countPieces } from "@/lib/checkers";

export type GameMode = "local" | "ai-easy" | "ai-smart";

interface GameSidebarProps {
  gameState: GameState;
  mode: GameMode;
  onNewGame: (mode: GameMode) => void;
  onShowCoach: () => void;
  playerSide: "red" | "black";
  gameOver: boolean;
  elapsedSeconds: number;
}

export default function GameSidebar({
  gameState,
  mode,
  onNewGame,
  onShowCoach,
  playerSide,
  gameOver,
  elapsedSeconds,
}: GameSidebarProps) {
  const { red, black } = countPieces(gameState.board);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

  const statusText = () => {
    if (gameState.status === "red_wins") return "🔴 Red wins!";
    if (gameState.status === "black_wins") return "⚫ Black wins!";
    if (gameState.status === "draw") return "🤝 Draw!";
    return gameState.currentPlayer === "red" ? "🔴 Red's turn" : "⚫ Black's turn";
  };

  const modeLabel = {
    local: "2 Players",
    "ai-easy": "vs Easy AI",
    "ai-smart": "vs Smart AI",
  }[mode];

  return (
    <div className="flex flex-col gap-4 min-w-[200px]">
      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <div className="text-lg font-bold text-center mb-2">{statusText()}</div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>🔴 {red} pieces</span>
          <span>⚫ {black} pieces</span>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          Move {gameState.moveCount} · {formatTime(elapsedSeconds)} · {modeLabel}
        </div>
      </div>

      {/* Hints */}
      {!gameOver && (
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 text-sm border border-blue-200 dark:border-blue-700">
          <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">💡 Hints</p>
          <ul className="text-blue-600 dark:text-blue-400 space-y-1 text-xs">
            <li>• Click a piece to see legal moves</li>
            <li>• Green dots = where you can move</li>
            <li>• Jumps are mandatory!</li>
            {gameState.allLegalMoves.some((m) => m.captures.length > 0) && (
              <li className="font-bold text-orange-500">⚠️ You must capture!</li>
            )}
          </ul>
        </div>
      )}

      {/* Coach button (after game) */}
      {gameOver && (
        <button
          onClick={onShowCoach}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-3 font-semibold transition-colors shadow"
        >
          🎓 View Coach Feedback
        </button>
      )}

      {/* New Game */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">New Game</p>
        <div className="flex flex-col gap-2">
          {(["local", "ai-easy", "ai-smart"] as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onNewGame(m)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m && !gameOver
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-gray-700 dark:text-gray-300"
              }`}
            >
              {m === "local" ? "👥 2 Players" : m === "ai-easy" ? "🤖 Easy AI" : "🧠 Smart AI"}
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow">
        <p className="font-bold text-sm mb-1">✨ Pro Plan</p>
        <p className="text-xs opacity-90 mb-3">
          Unlimited AI analysis, move replay, and online multiplayer.
        </p>
        <button
          onClick={() => alert("🚀 Coming soon! Join the waitlist at checkerscoach.app")}
          className="w-full bg-white text-indigo-700 rounded-lg py-1.5 text-sm font-semibold hover:bg-indigo-50 transition-colors"
        >
          Upgrade to Pro →
        </button>
      </div>
    </div>
  );
}
