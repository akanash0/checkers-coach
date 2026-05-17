import { Board, Move, GameState, getAllLegalMoves, applyMove, createInitialState } from "./checkers";

export interface CoachTip {
  emoji: string;
  title: string;
  detail: string;
}

// Re-simulate game from scratch to analyze what happened
export function analyzeGame(
  moveHistory: Move[],
  winner: "red" | "black" | "draw",
  playerSide: "red" | "black"
): CoachTip[] {
  const tips: CoachTip[] = [];

  let state = createInitialState();
  let missedCaptures = 0;
  let kingsGained = 0;
  let piecesLost = 0;
  let capturesMade = 0;
  let totalMoves = moveHistory.length;

  for (let i = 0; i < moveHistory.length; i++) {
    const move = moveHistory[i];
    const currentPlayer = state.currentPlayer;

    // Track captures made
    if (move.captures.length > 0) {
      capturesMade++;
    }

    // Track kings before and after move
    const kingsBefore = countKings(state.board, currentPlayer);
    const nextState = applyMove(state, move);
    const kingsAfter = countKings(nextState.board, currentPlayer);
    if (kingsAfter > kingsBefore) kingsGained++;

    // Check if opponent lost a piece after our move (we gained from capture)
    const oppBefore = countPieces(state.board, currentPlayer === "red" ? "black" : "red");
    const oppAfter = countPieces(nextState.board, currentPlayer === "red" ? "black" : "red");
    const ourBefore = countPieces(state.board, currentPlayer);
    const ourAfter = countPieces(nextState.board, currentPlayer);
    if (ourAfter < ourBefore && move.captures.length === 0) {
      // This shouldn't happen but just in case
    }

    state = nextState;
  }

  // Missed captures: count how many times a player skipped a jump (impossible in standard rules since jumps are mandatory)
  // Instead we analyze aggressiveness: ratio of capturing moves to total moves
  const playerMoves = moveHistory.filter((_, i) => {
    // Even indexed moves are red (moves first), odd are black
    return i % 2 === (playerSide === "red" ? 0 : 1);
  });
  const playerCaptures = playerMoves.filter((m) => m.captures.length > 0).length;

  // Win/loss tip
  if (winner === playerSide) {
    tips.push({
      emoji: "🏆",
      title: "You won!",
      detail: `Great game! You finished in ${totalMoves} total moves.`,
    });
  } else if (winner === "draw") {
    tips.push({
      emoji: "🤝",
      title: "It's a draw!",
      detail: "Evenly matched game. Try being more aggressive next time!",
    });
  } else {
    tips.push({
      emoji: "💪",
      title: "You lost — but you're learning!",
      detail: "Every loss is a lesson. Study the tips below to improve.",
    });
  }

  // King promotion tip
  if (kingsGained === 0) {
    tips.push({
      emoji: "👑",
      title: "No kings promoted",
      detail:
        "Try to push pieces to the back row to get kings — they can move backward and are much more powerful!",
    });
  } else {
    tips.push({
      emoji: "👑",
      title: `${kingsGained} king${kingsGained > 1 ? "s" : ""} promoted!`,
      detail:
        "Nice! Kings give you much more flexibility. Try to protect them once promoted.",
    });
  }

  // Capturing aggressiveness tip
  if (playerMoves.length > 0) {
    const captureRatio = playerCaptures / playerMoves.length;
    if (captureRatio < 0.2) {
      tips.push({
        emoji: "⚔️",
        title: "Low capture rate",
        detail:
          "You captured rarely. In checkers, capturing removes enemy pieces — always take jumps when available (they're mandatory anyway)!",
      });
    } else if (captureRatio > 0.4) {
      tips.push({
        emoji: "🔥",
        title: "Aggressive play!",
        detail:
          "You made lots of captures — great! Multi-jumps in one turn are especially powerful.",
      });
    }
  }

  // Game length tip
  if (totalMoves < 20) {
    tips.push({
      emoji: "⚡",
      title: "Very short game",
      detail:
        "The game ended quickly — likely due to an early blunder. Try to protect your pieces in the center of the board early on.",
    });
  } else if (totalMoves > 60) {
    tips.push({
      emoji: "🧠",
      title: "Long, strategic game",
      detail:
        "Long games require patience. Make sure every piece you move has a safe square to land on — avoid leaving pieces unprotected.",
    });
  }

  // General beginner tip (always show one)
  const beginnerTips = [
    {
      emoji: "🛡️",
      title: "Control the center",
      detail:
        "Pieces in the center of the board control more squares and are harder to trap. Try to occupy the middle early.",
    },
    {
      emoji: "📐",
      title: "Keep your back row",
      detail:
        "Don't rush all your pieces forward — leaving one piece on your back row prevents your opponent from getting easy kings.",
    },
    {
      emoji: "🔗",
      title: "Move in pairs",
      detail:
        "Pieces support each other when diagonal neighbors. A lone piece is easy to capture — try to keep your pieces connected.",
    },
  ];
  // Pick one based on move count (just for variety)
  tips.push(beginnerTips[totalMoves % beginnerTips.length]);

  return tips.slice(0, 5); // max 5 tips
}

function countKings(board: Board, player: "red" | "black"): number {
  let count = 0;
  for (const row of board) {
    for (const piece of row) {
      if (piece?.player === player && piece.type === "king") count++;
    }
  }
  return count;
}

function countPieces(board: Board, player: "red" | "black"): number {
  let count = 0;
  for (const row of board) {
    for (const piece of row) {
      if (piece?.player === player) count++;
    }
  }
  return count;
}
