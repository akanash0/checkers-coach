// ─── Types ───────────────────────────────────────────────────────────────────

export type Player = "red" | "black";
export type PieceType = "man" | "king";

export interface Piece {
  player: Player;
  type: PieceType;
}

// Board is 8x8. board[row][col] = Piece | null
export type Board = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  captures: Position[]; // squares captured along the way (for multi-jumps)
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  selectedSquare: Position | null;
  legalMoves: Move[]; // legal moves for selected piece
  allLegalMoves: Move[]; // all legal moves for current player
  status: "playing" | "red_wins" | "black_wins" | "draw";
  moveHistory: Move[];
  moveCount: number;
}

// ─── Board Setup ─────────────────────────────────────────────────────────────

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // Only dark squares (where row+col is odd)
      if ((row + col) % 2 === 1) {
        if (row < 3) {
          board[row][col] = { player: "black", type: "man" };
        } else if (row > 4) {
          board[row][col] = { player: "red", type: "man" };
        }
      }
    }
  }
  return board;
}

export function createInitialState(): GameState {
  const board = createInitialBoard();
  const allLegalMoves = getAllLegalMoves(board, "red"); // red (bottom) moves first
  return {
    board,
    currentPlayer: "red",
    selectedSquare: null,
    legalMoves: [],
    allLegalMoves,
    status: "playing",
    moveHistory: [],
    moveCount: 0,
  };
}

// ─── Move Generation ─────────────────────────────────────────────────────────

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Get all jump moves from a position (recursive for multi-jumps)
function getJumpsFrom(
  board: Board,
  pos: Position,
  piece: Piece,
  captured: Position[] = [],
  visitedTo: Position[] = []
): Move[] {
  const { row, col } = pos;
  const dirs = piece.type === "king" ? [-1, 1] : piece.player === "red" ? [-1] : [1];
  const moves: Move[] = [];

  for (const dr of dirs) {
    for (const dc of [-1, 1]) {
      const midRow = row + dr;
      const midCol = col + dc;
      const toRow = row + 2 * dr;
      const toCol = col + 2 * dc;

      if (!inBounds(toRow, toCol)) continue;

      const midPiece = board[midRow][midCol];
      const toPiece = board[toRow][toCol];

      // Mid must be enemy, destination must be empty
      if (!midPiece || midPiece.player === piece.player) continue;
      if (toPiece !== null) continue;

      // Don't re-capture the same piece
      const alreadyCaptured = captured.some(
        (c) => c.row === midRow && c.col === midCol
      );
      if (alreadyCaptured) continue;

      // Don't revisit the same destination (prevents infinite loops)
      const alreadyVisited = visitedTo.some(
        (v) => v.row === toRow && v.col === toCol
      );
      if (alreadyVisited) continue;

      const newCaptured = [...captured, { row: midRow, col: midCol }];
      const newVisited = [...visitedTo, { row: toRow, col: toCol }];

      // Simulate board with this jump applied
      const newBoard = simulateJump(board, pos, { row: toRow, col: toCol }, { row: midRow, col: midCol }, piece);

      // Check if becomes king mid-jump (kings gained mid-jump can't continue jumping in standard rules)
      const becomesKing =
        piece.type === "man" &&
        ((piece.player === "red" && toRow === 0) ||
          (piece.player === "black" && toRow === 7));

      if (becomesKing) {
        moves.push({ from: { row, col }, to: { row: toRow, col: toCol }, captures: newCaptured });
      } else {
        // Try to continue jumping
        const newPiece = { ...piece };
        const continuations = getJumpsFrom(newBoard, { row: toRow, col: toCol }, newPiece, newCaptured, newVisited);

        if (continuations.length === 0) {
          // No more jumps — this is a terminal jump
          moves.push({ from: { row, col }, to: { row: toRow, col: toCol }, captures: newCaptured });
        } else {
          // Return all continued jump chains (rebase from original piece position)
          for (const cont of continuations) {
            moves.push({ from: { row, col }, to: cont.to, captures: cont.captures });
          }
        }
      }
    }
  }

  return moves;
}

function simulateJump(
  board: Board,
  from: Position,
  to: Position,
  captured: Position,
  piece: Piece
): Board {
  const newBoard = board.map((r) => [...r]);
  newBoard[from.row][from.col] = null;
  newBoard[captured.row][captured.col] = null;
  newBoard[to.row][to.col] = piece;
  return newBoard;
}

// Get simple (non-jump) moves from a position
function getSimpleMoves(board: Board, pos: Position, piece: Piece): Move[] {
  const { row, col } = pos;
  const dirs = piece.type === "king" ? [-1, 1] : piece.player === "red" ? [-1] : [1];
  const moves: Move[] = [];

  for (const dr of dirs) {
    for (const dc of [-1, 1]) {
      const toRow = row + dr;
      const toCol = col + dc;
      if (inBounds(toRow, toCol) && board[toRow][toCol] === null) {
        moves.push({ from: pos, to: { row: toRow, col: toCol }, captures: [] });
      }
    }
  }
  return moves;
}

// Get ALL legal moves for a player. Mandatory jump rule: if any jump exists, only jumps are allowed.
export function getAllLegalMoves(board: Board, player: Player): Move[] {
  const jumps: Move[] = [];
  const simples: Move[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece || piece.player !== player) continue;

      const pos = { row, col };
      const pieceJumps = getJumpsFrom(board, pos, piece);
      jumps.push(...pieceJumps);

      if (pieceJumps.length === 0) {
        simples.push(...getSimpleMoves(board, pos, piece));
      }
    }
  }

  // Mandatory jump rule
  return jumps.length > 0 ? jumps : simples;
}

// Get legal moves for a specific piece
export function getLegalMovesForPiece(board: Board, pos: Position, player: Player): Move[] {
  const all = getAllLegalMoves(board, player);
  // If there are forced jumps, only return jumps from this piece
  return all.filter((m) => m.from.row === pos.row && m.from.col === pos.col);
}

// ─── Apply Move ──────────────────────────────────────────────────────────────

export function applyMove(state: GameState, move: Move): GameState {
  const board = state.board.map((r) => [...r]);
  const piece = board[move.from.row][move.from.col]!;

  // Remove piece from origin
  board[move.from.row][move.from.col] = null;

  // Remove all captured pieces
  for (const cap of move.captures) {
    board[cap.row][cap.col] = null;
  }

  // Promote to king if reaching back row
  let movedPiece = { ...piece };
  if (
    movedPiece.type === "man" &&
    ((movedPiece.player === "red" && move.to.row === 0) ||
      (movedPiece.player === "black" && move.to.row === 7))
  ) {
    movedPiece = { ...movedPiece, type: "king" };
  }

  board[move.to.row][move.to.col] = movedPiece;

  const nextPlayer: Player = state.currentPlayer === "red" ? "black" : "red";
  const nextMoves = getAllLegalMoves(board, nextPlayer);

  // Check win condition
  let status: GameState["status"] = "playing";
  if (nextMoves.length === 0) {
    status = state.currentPlayer === "red" ? "red_wins" : "black_wins";
  }

  const newHistory = [...state.moveHistory, move];

  return {
    board,
    currentPlayer: nextPlayer,
    selectedSquare: null,
    legalMoves: [],
    allLegalMoves: nextMoves,
    status,
    moveHistory: newHistory,
    moveCount: state.moveCount + 1,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function countPieces(board: Board): { red: number; black: number } {
  let red = 0;
  let black = 0;
  for (const row of board) {
    for (const piece of row) {
      if (piece?.player === "red") red++;
      if (piece?.player === "black") black++;
    }
  }
  return { red, black };
}
