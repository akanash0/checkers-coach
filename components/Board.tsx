"use client";

import { Board as BoardType, Move, Position, Piece } from "@/lib/checkers";

interface BoardProps {
  board: BoardType;
  selectedSquare: Position | null;
  legalMoves: Move[];
  onSquareClick: (pos: Position) => void;
  flipped?: boolean;
}

export default function Board({
  board,
  selectedSquare,
  legalMoves,
  onSquareClick,
  flipped = false,
}: BoardProps) {
  const legalToSet = new Set(legalMoves.map((m) => `${m.to.row},${m.to.col}`));
  const captureSet = new Set(
    legalMoves.flatMap((m) => m.captures.map((c) => `${c.row},${c.col}`))
  );

  const rows = flipped ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];
  const cols = flipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];

  return (
    <div style={{
      display: "inline-block",
      border: "4px solid #78350f",
      borderRadius: "8px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      overflow: "hidden",
    }}>
      {rows.map((row) => (
        <div key={row} style={{ display: "flex" }}>
          {cols.map((col) => {
            const isDark = (row + col) % 2 === 1;
            const piece = board[row][col];
            const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;
            const isLegalTarget = legalToSet.has(`${row},${col}`);
            const isCaptureHighlight = captureSet.has(`${row},${col}`);

            return (
              <Square
                key={col}
                isDark={isDark}
                piece={piece}
                isSelected={isSelected}
                isLegalTarget={isLegalTarget}
                isCaptureHighlight={isCaptureHighlight}
                onClick={() => onSquareClick({ row, col })}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface SquareProps {
  isDark: boolean;
  piece: Piece | null;
  isSelected: boolean;
  isLegalTarget: boolean;
  isCaptureHighlight: boolean;
  onClick: () => void;
}

function Square({ isDark, piece, isSelected, isLegalTarget, isCaptureHighlight, onClick }: SquareProps) {
  // Square background
  let bg = isDark ? "#7c3f00" : "#f0d9b5"; // chess.com brown palette
  if (isDark && isSelected) bg = "#cdd16e";
  if (isDark && isLegalTarget && !piece) bg = "#7c3f00"; // keep dark, dot shows on top
  if (!isDark && isLegalTarget && !piece) bg = "#f0d9b5";

  const squareSize = "clamp(44px, 10vw, 72px)";

  return (
    <div
      onClick={onClick}
      style={{
        width: squareSize,
        height: squareSize,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        cursor: "pointer",
        outline: isCaptureHighlight ? "3px solid #f87171" : "none",
        outlineOffset: "-3px",
        transition: "background 0.1s",
        boxSizing: "border-box",
      }}
    >
      {/* Legal move indicator dot */}
      {isLegalTarget && !piece && (
        <div style={{
          width: "30%",
          height: "30%",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.35)",
          pointerEvents: "none",
          zIndex: 2,
        }} />
      )}

      {/* Legal move ring (when target square has a capture) */}
      {isLegalTarget && piece && (
        <div style={{
          position: "absolute",
          inset: 0,
          border: "4px solid rgba(0,0,0,0.35)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 3,
        }} />
      )}

      {/* Piece */}
      {piece && <Checker piece={piece} isSelected={isSelected} />}
    </div>
  );
}

function Checker({ piece, isSelected }: { piece: Piece; isSelected: boolean }) {
  const isRed = piece.player === "red";

  // Outer ring color
  const outerBg = isRed ? "#991b1b" : "#1c1917";
  // Main piece color
  const innerBg = isRed ? "#ef4444" : "#44403c";
  // Highlight arc (top-left shine)
  const shineBg = isRed ? "#fca5a5" : "#78716c";

  const size = "clamp(36px, 8vw, 58px)";
  const innerSize = "84%";

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: outerBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 2,
      boxShadow: isSelected
        ? `0 0 0 4px #fde047, 0 6px 16px rgba(0,0,0,0.6)`
        : `0 4px 10px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3)`,
      transform: isSelected ? "scale(1.12)" : "scale(1)",
      transition: "transform 0.12s, box-shadow 0.12s",
      cursor: "pointer",
    }}>
      {/* Inner disc */}
      <div style={{
        width: innerSize,
        height: innerSize,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${shineBg} 0%, ${innerBg} 55%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        {/* King crown */}
        {piece.type === "king" && (
          <span style={{
            fontSize: "clamp(12px, 2.5vw, 20px)",
            lineHeight: 1,
            userSelect: "none",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
          }}>
            ♛
          </span>
        )}
      </div>
    </div>
  );
}
