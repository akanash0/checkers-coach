"use client";

import { SavedGame } from "@/lib/storage";
import { useEffect, useState } from "react";

interface MoveHistoryProps {
  savedGames: SavedGame[];
  onClear: () => void;
}

export default function MoveHistory({ savedGames, onClear }: MoveHistoryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (savedGames.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">📋 Game History</p>
        <p className="text-sm text-gray-400">No games yet. Play a game to see history!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <p className="font-semibold text-gray-700 dark:text-gray-300">📋 Game History</p>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {savedGames.map((game) => (
          <div
            key={game.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5 text-sm"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {game.winner === "red"
                  ? "🔴 Red won"
                  : game.winner === "black"
                  ? "⚫ Black won"
                  : "🤝 Draw"}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(game.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{game.moveCount} moves</span>
              <span>
                {game.mode === "local"
                  ? "👥 2P"
                  : game.mode === "ai-easy"
                  ? "🤖 Easy"
                  : "🧠 Smart"}
              </span>
              <span>
                {Math.floor(game.durationSeconds / 60)}m {game.durationSeconds % 60}s
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
