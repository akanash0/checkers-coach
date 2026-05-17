export interface SavedGame {
  id: string;
  date: string;
  winner: "red" | "black" | "draw";
  moveCount: number;
  mode: "local" | "ai-easy" | "ai-smart";
  durationSeconds: number;
}

const STORAGE_KEY = "checkers_coach_history";

export function saveGame(game: Omit<SavedGame, "id">): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const newGame: SavedGame = { ...game, id: Date.now().toString() };
  history.unshift(newGame); // newest first
  // Keep max 20 games
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
}

export function getHistory(): SavedGame[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
