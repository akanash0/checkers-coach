import { Board, Move, Player, getAllLegalMoves } from "./checkers";

// Easy AI: pick a random legal move
export function easyAI(board: Board, player: Player): Move | null {
  const moves = getAllLegalMoves(board, player);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

// Smart AI: prioritize captures > king promotions > king moves > simple moves
export function smartAI(board: Board, player: Player): Move | null {
  const moves = getAllLegalMoves(board, player);
  if (moves.length === 0) return null;

  // Score each move
  function scoreMove(move: Move): number {
    let score = 0;

    // Captures are highest priority
    score += move.captures.length * 100;

    // Check if this move promotes to king
    const piece = board[move.from.row][move.from.col];
    if (piece?.type === "man") {
      if (
        (player === "red" && move.to.row === 0) ||
        (player === "black" && move.to.row === 7)
      ) {
        score += 50;
      }
    }

    // Prefer moving kings
    if (piece?.type === "king") {
      score += 10;
    }

    // Prefer advancing forward (toward promotion)
    if (player === "red") {
      score += (7 - move.to.row); // lower row = more advanced for red
    } else {
      score += move.to.row; // higher row = more advanced for black
    }

    return score;
  }

  const scored = moves.map((m) => ({ move: m, score: scoreMove(m) }));
  scored.sort((a, b) => b.score - a.score);

  // Pick from top moves with some randomness (not purely deterministic)
  const topScore = scored[0].score;
  const topMoves = scored.filter((s) => s.score === topScore);
  return topMoves[Math.floor(Math.random() * topMoves.length)].move;
}
