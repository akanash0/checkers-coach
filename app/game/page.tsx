"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Board from "@/components/Board";
import MoveHistory from "@/components/MoveHistory";
import CoachModal from "@/components/CoachModal";
import { GameMode } from "@/components/GameSidebar";
import {
  createInitialState,
  GameState,
  Position,
  getLegalMovesForPiece,
  applyMove,
} from "@/lib/checkers";
import { easyAI, smartAI } from "@/lib/ai";
import { saveGame, getHistory, clearHistory } from "@/lib/storage";
import { analyzeGame, CoachTip } from "@/lib/coach";

export default function GamePage() {
  const [gameState, setGameState]   = useState<GameState>(createInitialState());
  const [mode, setMode]             = useState<GameMode>("local");
  const [playerSide]                = useState<"red" | "black">("red");
  const [showCoach, setShowCoach]   = useState(false);
  const [coachTips, setCoachTips]   = useState<CoachTip[]>([]);
  const [savedGames, setSavedGames] = useState(getHistory());
  const [elapsedSeconds, setElapsed] = useState(0);
  const [gameOver, setGameOver]     = useState(false);
  const [dark, setDark]             = useState(false);

  const startTimeRef    = useRef<number>(Date.now());
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiThinkingRef   = useRef(false);
  const elapsedRef      = useRef(0);           // avoids stale closure in game-over handler
  const coachTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef      = useRef(true);        // prevents setState after unmount

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    setSavedGames(getHistory());
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!gameOver) {
        const s = Math.floor((Date.now() - startTimeRef.current) / 1000);
        elapsedRef.current = s;
        setElapsed(s);
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameOver]);

  // ── Game-over detection ────────────────────────────────────────────────────
  //
  // KEY FIX: we use a ref (gameStateRef) to always read the latest gameState
  // inside the effect, avoiding the stale-closure problem where moveHistory
  // would appear empty because the effect captured an old snapshot.
  //
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  useEffect(() => {
    if (gameState.status === "playing" || gameOver) return;

    setGameOver(true);
    if (timerRef.current)  clearInterval(timerRef.current);
    if (coachTimerRef.current) clearTimeout(coachTimerRef.current);

    const winner =
      gameState.status === "red_wins"   ? "red"   :
      gameState.status === "black_wins" ? "black" : "draw";

    // Read moveHistory from the ref so we always get the final, up-to-date list
    const finalHistory = gameStateRef.current.moveHistory;

    saveGame({
      date:            new Date().toISOString(),
      winner,
      moveCount:       gameState.moveCount,
      mode,
      durationSeconds: elapsedRef.current,
    });
    setSavedGames(getHistory());

    const tips = analyzeGame(finalHistory, winner, playerSide);
    setCoachTips(tips);

    // Show coach modal after a short pause so the board result is visible first
    coachTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setShowCoach(true);
    }, 700);

  // We intentionally only re-run when status changes, not on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.status]);

  // ── AI move ────────────────────────────────────────────────────────────────
  const doAIMove = useCallback((state: GameState, aiMode: GameMode) => {
    if (aiThinkingRef.current) return;
    aiThinkingRef.current = true;
    setTimeout(() => {
      const move =
        aiMode === "ai-easy"
          ? easyAI(state.board, state.currentPlayer)
          : smartAI(state.board, state.currentPlayer);
      if (move) setGameState((prev) => applyMove(prev, move));
      aiThinkingRef.current = false;
    }, 450);
  }, []);

  useEffect(() => {
    if (gameOver || mode === "local" || gameState.status !== "playing") return;
    if (gameState.currentPlayer === "black") doAIMove(gameState, mode);
  }, [gameState, mode, gameOver, doAIMove]);

  // ── Click handler ──────────────────────────────────────────────────────────
  function handleSquareClick(pos: Position) {
    if (gameOver) return;
    if (mode !== "local" && gameState.currentPlayer !== playerSide) return;

    const { board, currentPlayer, selectedSquare, legalMoves } = gameState;

    // Try to execute a move to this square
    if (selectedSquare) {
      const targetMove = legalMoves.find(
        (m) => m.to.row === pos.row && m.to.col === pos.col
      );
      if (targetMove) {
        setGameState((prev) => applyMove(prev, targetMove));
        return;
      }
    }

    // Otherwise try to select a piece
    const piece = board[pos.row][pos.col];
    if (piece && piece.player === currentPlayer) {
      const moves = getLegalMovesForPiece(board, pos, currentPlayer);
      setGameState((prev) => ({
        ...prev,
        selectedSquare: moves.length > 0 ? pos : null,
        legalMoves:     moves,
      }));
    } else {
      setGameState((prev) => ({ ...prev, selectedSquare: null, legalMoves: [] }));
    }
  }

  // ── New game ───────────────────────────────────────────────────────────────
  function startNewGame(newMode: GameMode) {
    if (coachTimerRef.current) clearTimeout(coachTimerRef.current);
    setGameState(createInitialState());
    setMode(newMode);
    setGameOver(false);
    setShowCoach(false);
    setElapsed(0);
    elapsedRef.current    = 0;
    startTimeRef.current  = Date.now();
    aiThinkingRef.current = false;
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  const bg      = dark ? "#0f172a" : "#f1f5f9";
  const surface = dark ? "#1e293b" : "#ffffff";
  const border  = dark ? "#334155" : "#e2e8f0";
  const text    = dark ? "#f8fafc" : "#0f172a";
  const muted   = dark ? "#94a3b8" : "#64748b";

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const statusLabel =
    gameState.status === "red_wins"   ? "🔴 Red wins!"    :
    gameState.status === "black_wins" ? "⚫ Black wins!"  :
    gameState.currentPlayer === "red" ? "🔴 Red to move"  : "⚫ Black to move";

  const mustJump =
    !gameOver &&
    gameState.allLegalMoves.some((m) => m.captures.length > 0);

  // Piece counts for the sidebar bar
  let redPieces = 0, blackPieces = 0;
  for (const row of gameState.board) {
    for (const p of row) {
      if (p?.player === "red")   redPieces++;
      if (p?.player === "black") blackPieces++;
    }
  }
  const advantage = redPieces - blackPieces;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight:  "100vh",
        background: bg,
        color:      text,
        fontFamily: "system-ui, sans-serif",
        // position:relative is NOT set here on purpose — CoachModal uses
        // position:fixed which breaks out of all ancestors naturally.
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background:   surface,
          borderBottom: `1px solid ${border}`,
          padding:      "12px 24px",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "8px",
            fontWeight:     700,
            fontSize:       "18px",
            color:          text,
            textDecoration: "none",
          }}
        >
          ♟️ Checkers Coach
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: muted }}>
            {mode === "local"    ? "👥 2 Players" :
             mode === "ai-easy"  ? "🤖 Easy AI"  : "🧠 Smart AI"}
          </span>
          <button
            onClick={() => setDark(!dark)}
            style={{
              padding:      "6px 10px",
              borderRadius: "8px",
              border:       `1px solid ${border}`,
              background:   surface,
              color:        text,
              cursor:       "pointer",
              fontSize:     "16px",
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>
        <div
          style={{
            display:        "flex",
            flexWrap:       "wrap",
            gap:            "24px",
            alignItems:     "flex-start",
            justifyContent: "center",
          }}
        >
          {/* Board column */}
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              gap:            "10px",
            }}
          >
            {/* Status banner */}
            <div
              style={{
                background:   surface,
                border:       `1px solid ${border}`,
                borderRadius: "12px",
                padding:      "10px 20px",
                fontWeight:   600,
                fontSize:     "16px",
                display:      "flex",
                alignItems:   "center",
                gap:          "14px",
                color:        text,
                boxShadow:    "0 1px 4px rgba(0,0,0,0.08)",
                flexWrap:     "wrap",
              }}
            >
              <span>{statusLabel}</span>
              <span style={{ color: muted, fontWeight: 400, fontSize: "13px" }}>
                Move {gameState.moveCount} · {fmt(elapsedSeconds)}
              </span>
              {mustJump && (
                <span
                  style={{
                    background:   "#fef3c7",
                    color:        "#92400e",
                    borderRadius: "6px",
                    padding:      "2px 10px",
                    fontSize:     "12px",
                    fontWeight:   700,
                  }}
                >
                  ⚠ Must jump!
                </span>
              )}
            </div>

            {/* Black / top player label */}
            <TurnLabel
              label={mode !== "local" ? "⚫ Black (AI)" : "⚫ Black"}
              active={gameState.currentPlayer === "black" && !gameOver}
              surface={surface} border={border} text={text} muted={muted}
            />

            <Board
              board={gameState.board}
              selectedSquare={gameState.selectedSquare}
              legalMoves={gameState.legalMoves}
              onSquareClick={handleSquareClick}
            />

            {/* Red / bottom player label */}
            <TurnLabel
              label={mode !== "local" ? "🔴 Red (You)" : "🔴 Red"}
              active={gameState.currentPlayer === "red" && !gameOver}
              surface={surface} border={border} text={text} muted={muted}
            />
          </div>

          {/* Right panel */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           "14px",
              minWidth:      "220px",
              flex:          "1 1 220px",
              maxWidth:      "280px",
            }}
          >
            {/* How to play (only while playing) */}
            {!gameOver && (
              <div
                style={{
                  background:   dark ? "#1e3a5f" : "#eff6ff",
                  border:       `1px solid ${dark ? "#2563eb" : "#bfdbfe"}`,
                  borderRadius: "12px",
                  padding:      "12px 16px",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    color:      dark ? "#93c5fd" : "#1d4ed8",
                    fontSize:   "14px",
                    margin:     "0 0 6px",
                  }}
                >
                  💡 How to play
                </p>
                <ul
                  style={{
                    margin:     0,
                    padding:    0,
                    listStyle:  "none",
                    fontSize:   "13px",
                    color:      dark ? "#bfdbfe" : "#1e40af",
                    lineHeight: "1.9",
                  }}
                >
                  <li>• Click a piece to select it</li>
                  <li>• Green dots = legal moves</li>
                  <li>• Jumps are mandatory</li>
                </ul>
              </div>
            )}

            {/* Game-over card with Coach CTA */}
            {gameOver && (
              <div
                style={{
                  background:   "linear-gradient(135deg, #6d28d9, #4f46e5)",
                  borderRadius: "14px",
                  padding:      "18px",
                  color:        "#fff",
                  textAlign:    "center",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "6px" }}>
                  {gameState.status === "red_wins"   ? "🏆" :
                   gameState.status === "black_wins" ? "😤" : "🤝"}
                </div>
                <p style={{ fontWeight: 800, fontSize: "18px", margin: "0 0 4px" }}>
                  {statusLabel}
                </p>
                <p style={{ fontSize: "13px", opacity: 0.85, margin: "0 0 14px" }}>
                  Game over in {gameState.moveCount} moves
                </p>
                <button
                  onClick={() => setShowCoach(true)}
                  style={{
                    width:        "100%",
                    padding:      "11px",
                    borderRadius: "10px",
                    background:   "#ffffff",
                    color:        "#4f46e5",
                    border:       "none",
                    fontWeight:   800,
                    fontSize:     "14px",
                    cursor:       "pointer",
                  }}
                >
                  🎓 View Coach Feedback
                </button>
              </div>
            )}

            {/* New game buttons */}
            <div
              style={{
                background:   surface,
                border:       `1px solid ${border}`,
                borderRadius: "12px",
                padding:      "16px",
              }}
            >
              <p style={{ fontWeight: 600, fontSize: "13px", color: muted, margin: "0 0 10px" }}>
                New Game
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(["local", "ai-easy", "ai-smart"] as GameMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => startNewGame(m)}
                    style={{
                      padding:      "10px 12px",
                      borderRadius: "8px",
                      textAlign:    "left",
                      border:       `1px solid ${mode === m && !gameOver ? "#6366f1" : border}`,
                      background:   mode === m && !gameOver ? "#6366f1" : surface,
                      color:        mode === m && !gameOver ? "#fff" : text,
                      fontWeight:   500,
                      fontSize:     "14px",
                      cursor:       "pointer",
                    }}
                  >
                    {m === "local"    ? "👥 Local 2 Players" :
                     m === "ai-easy" ? "🤖 Easy AI"         : "🧠 Smart AI"}
                  </button>
                ))}
              </div>
            </div>

            {/* Piece count */}
            <div
              style={{
                background:   surface,
                border:       `1px solid ${border}`,
                borderRadius: "12px",
                padding:      "16px",
              }}
            >
              <p style={{ fontWeight: 600, fontSize: "13px", color: muted, margin: "0 0 12px" }}>
                Piece Count
              </p>
              <div
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "center",
                  marginBottom:   "10px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#ef4444" }}>
                    {redPieces}
                  </div>
                  <div style={{ fontSize: "11px", color: muted }}>🔴 Red</div>
                </div>
                <div style={{ fontSize: "12px", color: muted, fontWeight: 600 }}>
                  {advantage > 0 ? `+${advantage} Red` :
                   advantage < 0 ? `+${Math.abs(advantage)} Black` : "Even"}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: text }}>
                    {blackPieces}
                  </div>
                  <div style={{ fontSize: "11px", color: muted }}>⚫ Black</div>
                </div>
              </div>
              <div
                style={{
                  height:       "6px",
                  borderRadius: "99px",
                  background:   dark ? "#334155" : "#e2e8f0",
                  overflow:     "hidden",
                }}
              >
                <div
                  style={{
                    height:       "100%",
                    width:        `${(redPieces / (redPieces + blackPieces || 1)) * 100}%`,
                    background:   "#ef4444",
                    borderRadius: "99px",
                    transition:   "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {/* Pro upsell */}
            <div
              style={{
                background:   "linear-gradient(135deg, #4f46e5, #7c3aed)",
                borderRadius: "12px",
                padding:      "16px",
                color:        "#fff",
              }}
            >
              <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "14px" }}>
                ✨ Pro Plan
              </p>
              <p style={{ fontSize: "12px", opacity: 0.85, margin: "0 0 12px", lineHeight: 1.5 }}>
                Move replay, advanced AI, online multiplayer.
              </p>
              <button
                onClick={() => alert("🚀 Coming soon! Join the waitlist.")}
                style={{
                  width:        "100%",
                  padding:      "8px",
                  borderRadius: "8px",
                  background:   "#fff",
                  color:        "#4f46e5",
                  border:       "none",
                  fontWeight:   700,
                  fontSize:     "13px",
                  cursor:       "pointer",
                }}
              >
                Upgrade to Pro →
              </button>
            </div>

            {/* History */}
            <MoveHistory
              savedGames={savedGames}
              onClear={() => { clearHistory(); setSavedGames([]); }}
            />
          </div>
        </div>
      </main>

      {/* ── Coach Modal ── rendered here but uses position:fixed so it floats above everything */}
      {showCoach && (
        <CoachModal
          tips={coachTips}
          dark={dark}
          onClose={() => setShowCoach(false)}
          onNewGame={() => { setShowCoach(false); startNewGame(mode); }}
        />
      )}
    </div>
  );
}

// ── TurnLabel helper ─────────────────────────────────────────────────────────

function TurnLabel({
  label, active, surface, border, text, muted,
}: {
  label:   string;
  active:  boolean;
  surface: string;
  border:  string;
  text:    string;
  muted:   string;
}) {
  return (
    <div
      style={{
        background:   active ? "#fef9c3" : surface,
        border:       `1px solid ${active ? "#fde047" : border}`,
        borderRadius: "8px",
        padding:      "6px 20px",
        fontWeight:   active ? 700 : 500,
        fontSize:     "14px",
        color:        active ? "#713f12" : muted,
        transition:   "all 0.2s",
        minWidth:     "200px",
        textAlign:    "center",
      }}
    >
      {label}
      {active && (
        <span style={{ marginLeft: "8px", fontSize: "12px" }}>← to move</span>
      )}
    </div>
  );
}
