"use client";

import { CoachTip } from "@/lib/coach";
import { useEffect, useRef } from "react";

interface CoachModalProps {
  tips: CoachTip[];
  dark?: boolean;
  onClose: () => void;
  onNewGame: () => void;
}

export default function CoachModal({
  tips,
  dark = false,
  onClose,
  onNewGame,
}: CoachModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Scroll lock while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Theme colours ──────────────────────────────────────────────────────
  const overlay   = "rgba(0, 0, 0, 0.72)";
  const cardBg    = dark ? "#1e293b" : "#ffffff";
  const tipBg     = dark ? "#0f172a" : "#f8fafc";
  const tipBorder = dark ? "#334155" : "#e2e8f0";
  const titleCol  = dark ? "#f8fafc" : "#0f172a";
  const bodyCol   = dark ? "#94a3b8" : "#475569";
  const btnBorder = dark ? "#334155" : "#e2e8f0";

  // Friendly fallback when analyzeGame returns nothing (e.g. 0-move game)
  const displayTips: CoachTip[] =
    tips.length > 0
      ? tips
      : [
          {
            emoji: "♟️",
            title: "Game recorded!",
            detail:
              "The game was too short to analyse in detail. Play a full game for personalised coaching tips.",
          },
          {
            emoji: "💡",
            title: "Tip: control the centre",
            detail:
              "Pieces in the middle of the board control more squares and are much harder for your opponent to trap.",
          },
          {
            emoji: "👑",
            title: "Tip: aim for kings",
            detail:
              "Push one piece all the way to the back row to promote it — kings move both forward and backward.",
          },
        ];

  return (
    
// Fixed overlay keeps the coach modal above the game UI.
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Coach Feedback"
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         99999,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "16px",
        background:     overlay,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position:    "relative",
          width:       "100%",
          maxWidth:    "460px",
          maxHeight:   "90vh",
          overflowY:   "auto",
          background:  cardBg,
          borderRadius: "20px",
          padding:     "28px",
          boxShadow:   "0 32px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
          animation:   "coachSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          aria-label="Close coach feedback"
          style={{
            position:   "absolute",
            top:        "16px",
            right:      "16px",
            width:      "32px",
            height:     "32px",
            borderRadius: "8px",
            border:     `1px solid ${tipBorder}`,
            background: tipBg,
            color:      bodyCol,
            fontSize:   "16px",
            lineHeight: "1",
            cursor:     "pointer",
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "22px", paddingRight: "32px" }}>
          <div style={{ fontSize: "52px", lineHeight: "1", marginBottom: "10px" }}>🎓</div>
          <h2
            style={{
              margin:     "0 0 6px",
              fontSize:   "22px",
              fontWeight: "800",
              color:      titleCol,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Coach Feedback
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: bodyCol }}>
            Here&apos;s what we noticed about your game
          </p>
        </div>

        {/* ── Tips ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {displayTips.map((tip, i) => (
            <div
              key={i}
              style={{
                display:      "flex",
                gap:          "14px",
                alignItems:   "flex-start",
                background:   tipBg,
                border:       `1px solid ${tipBorder}`,
                borderRadius: "12px",
                padding:      "13px 15px",
              }}
            >
              <span style={{ fontSize: "26px", flexShrink: 0, lineHeight: "1.3" }}>
                {tip.emoji}
              </span>
              <div>
                <p
                  style={{
                    margin:     "0 0 4px",
                    fontSize:   "14px",
                    fontWeight: "700",
                    color:      titleCol,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {tip.title}
                </p>
                <p
                  style={{
                    margin:     0,
                    fontSize:   "13px",
                    color:      bodyCol,
                    lineHeight: "1.65",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {tip.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pro upsell ── */}
        <div
          style={{
            background:   dark
              ? "linear-gradient(135deg, #2e1065, #1e1b4b)"
              : "linear-gradient(135deg, #ede9fe, #ddd6fe)",
            border:       `1px solid ${dark ? "#4c1d95" : "#c4b5fd"}`,
            borderRadius: "12px",
            padding:      "14px 16px",
            textAlign:    "center",
            marginBottom: "18px",
          }}
        >
          <p
            style={{
              margin:     "0 0 4px",
              fontWeight: "700",
              fontSize:   "14px",
              color:      dark ? "#c4b5fd" : "#5b21b6",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            ✨ Want deeper analysis?
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: dark ? "#a78bfa" : "#6d28d9", fontFamily: "system-ui, sans-serif" }}>
            Pro users get move-by-move AI replay and personalised training plans.
          </p>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex:         "1",
              padding:      "12px",
              borderRadius: "10px",
              border:       `1px solid ${btnBorder}`,
              background:   cardBg,
              color:        titleCol,
              fontWeight:   "600",
              fontSize:     "14px",
              cursor:       "pointer",
              fontFamily:   "system-ui, sans-serif",
            }}
          >
            Close
          </button>
          <button
            onClick={onNewGame}
            style={{
              flex:         "1",
              padding:      "12px",
              borderRadius: "10px",
              border:       "none",
              background:   "linear-gradient(135deg, #6366f1, #4f46e5)",
              color:        "#ffffff",
              fontWeight:   "700",
              fontSize:     "14px",
              cursor:       "pointer",
              boxShadow:    "0 4px 12px rgba(99,102,241,0.4)",
              fontFamily:   "system-ui, sans-serif",
            }}
          >
            Play Again →
          </button>
        </div>
      </div>

      {/* Slide-up keyframe injected once */}
      <style>{`
        @keyframes coachSlideUp {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0px)  scale(1);    }
        }
      `}</style>
    </div>
  );
}
