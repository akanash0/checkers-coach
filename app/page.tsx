"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
  }, []);

  // ── Theme ──────────────────────────────────────────────────────────────────
  const bg      = dark ? "#0f172a" : "#f8fafc";
  const surface = dark ? "#1e293b" : "#ffffff";
  const border  = dark ? "#334155" : "#e2e8f0";
  const text    = dark ? "#f8fafc" : "#0f172a";
  const muted   = dark ? "#94a3b8" : "#64748b";
  const subtle  = dark ? "#0f172a" : "#f1f5f9";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "system-ui, sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 20, color: text }}>
          <span>♟️</span> Checkers Coach
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setDark(!dark)}
            style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${border}`, background: surface, color: text, cursor: "pointer", fontSize: 16 }}
          >
            {dark ? "☀️" : "🌙"}
          </button>
          <Link
            href="/game"
            style={{ background: "#6366f1", color: "#fff", padding: "9px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }}
          >
            Play Now →
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: dark ? "#1e3a5f" : "#eff6ff", border: `1px solid ${dark ? "#3b82f6" : "#bfdbfe"}`, borderRadius: 99, padding: "5px 14px", marginBottom: 28 }}>
          <span style={{ fontSize: 12 }}>🏆</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#93c5fd" : "#1d4ed8" }}>Built for nFactorial Incubator 2024</span>
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900, margin: "0 0 20px", lineHeight: 1.1, color: text }}>
          Learn Checkers the
          <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block" }}>
            Smart Way
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: muted, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.65 }}>
          Play checkers with legal move hints, challenge an AI opponent, and get
          personalized coaching tips after every game. Perfect for beginners and kids.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/game"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", padding: "14px 32px", borderRadius: 12,
              fontWeight: 700, fontSize: 16, textDecoration: "none",
              boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            🎮 Start Playing Free
          </Link>
          <a
            href="#features"
            style={{
              border: `1px solid ${border}`, color: text,
              padding: "14px 32px", borderRadius: 12,
              fontWeight: 600, fontSize: 16, textDecoration: "none",
              background: surface,
            }}
          >
            Learn More ↓
          </a>
        </div>

        {/* Social proof strip */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 52, flexWrap: "wrap" }}>
          {[["♟️", "Full Rules", "Multi-jumps, kings"], ["🤖", "Built-in AI", "Easy & Smart modes"], ["🎓", "AI Coach", "Post-game tips"]].map(([emoji, title, sub]) => (
            <div key={title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: text }}>{title}</div>
              <div style={{ fontSize: 13, color: muted }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Board preview strip ─────────────────────────────────────────────── */}
      <div style={{ background: dark ? "#1e293b" : "#f1f5f9", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: "20px 0", display: "flex", justifyContent: "center", gap: 4, overflow: "hidden" }}>
        {BOARD_PREVIEW.map((row, ri) => (
          <div key={ri} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {row.map((cell, ci) => (
              <div
                key={ci}
                style={{
                  width: 28, height: 28, borderRadius: 4,
                  background: cell === "." ? (dark ? "#2d1a00" : "#7c3f00") : cell === "R" ? "#7c3f00" : dark ? "#1e293b" : "#f0d9b5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: (ri === 0 || ri === 7 || ci === 0 || ci === 7) ? 0.4 : 1,
                }}
              >
                {cell === "r" && <div style={{ width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fca5a5, #ef4444)" }} />}
                {cell === "b" && <div style={{ width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #78716c, #1c1917)" }} />}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" style={{ maxWidth: 1000, margin: "0 auto", padding: "72px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, margin: "0 0 8px", color: text }}>Why Checkers Coach?</h2>
        <p style={{ textAlign: "center", color: muted, margin: "0 0 48px", fontSize: 16 }}>
          Everything a beginner needs to actually improve
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.emoji}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, margin: "0 0 8px", color: text }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: muted, margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section style={{ background: dark ? "#1e293b" : "#f1f5f9", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: "72px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, margin: "0 0 48px", color: text }}>How it works</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.title} style={{ flex: "1 1 200px", textAlign: "center", padding: "0 20px", position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: 22, right: -8, fontSize: 20, color: muted, display: "none" }} className="step-arrow">→</div>
                )}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", fontWeight: 800, fontSize: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, margin: "0 0 6px", color: text }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "72px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, margin: "0 0 8px", color: text }}>Simple Pricing</h2>
        <p style={{ textAlign: "center", color: muted, margin: "0 0 48px", fontSize: 16 }}>Start free, upgrade when you&apos;re ready</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {/* Free */}
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 28 }}>
            <p style={{ fontWeight: 800, fontSize: 20, margin: "0 0 4px", color: text }}>Free</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: text }}>$0</span>
              <span style={{ fontSize: 16, color: muted }}>/month</span>
            </div>
            <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Full checkers game", "2 AI difficulty levels", "Basic coaching tips", "Game history (20 games)"].map(f => (
                <li key={f} style={{ display: "flex", gap: 10, fontSize: 14, color: text, alignItems: "center" }}>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/game"
              style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
            >
              Play Free →
            </Link>
          </div>

          {/* Pro */}
          <div style={{ background: "linear-gradient(145deg, #4f46e5, #7c3aed)", borderRadius: 20, padding: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 16, right: 16, background: "#fbbf24", color: "#713f12", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 99 }}>
              COMING SOON
            </div>
            <p style={{ fontWeight: 800, fontSize: 20, margin: "0 0 4px" }}>Pro</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 42, fontWeight: 900 }}>$4</span>
              <span style={{ fontSize: 16, opacity: 0.7 }}>/month</span>
            </div>
            <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Everything in Free", "Move-by-move AI replay", "Advanced coach analysis", "Online multiplayer", "Unlimited game history"].map(f => (
                <li key={f} style={{ display: "flex", gap: 10, fontSize: 14, alignItems: "center" }}>
                  <span style={{ color: "#fbbf24" }}>★</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert("🚀 Pro is coming soon! We'll notify you at launch.")}
              style={{ width: "100%", padding: "13px", borderRadius: 10, background: "#fff", color: "#4f46e5", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
            >
              Join Waitlist →
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>Ready to start learning?</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 28px", fontSize: 16 }}>No account needed. Just open and play.</p>
        <Link
          href="/game"
          style={{ display: "inline-block", background: "#fff", color: "#4f46e5", padding: "14px 36px", borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}
        >
          🎮 Play Now — It&apos;s Free
        </Link>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: surface, borderTop: `1px solid ${border}`, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontWeight: 700, color: text, display: "flex", alignItems: "center", gap: 6 }}>
          ♟️ Checkers Coach
        </div>
        <div style={{ fontSize: 13, color: muted }}>Built with ❤️ for nFactorial Incubator · 2024</div>
        <Link href="/game" style={{ fontSize: 13, color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>Play →</Link>
      </footer>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────

const FEATURES = [
  { emoji: "💡", title: "Legal Move Hints", desc: "Click any piece to see exactly where it can move. Green dots highlight every legal square — perfect for beginners learning the rules." },
  { emoji: "🤖", title: "Built-in AI Opponent", desc: "Play against Easy AI (random moves) or Smart AI (strategic — prioritizes captures, kings, and advancement). All runs in your browser." },
  { emoji: "🎓", title: "Post-Game Coaching", desc: "After every game, get 3–5 personalized tips based on how you played — kings promoted, captures made, game length, and more." },
  { emoji: "♟️", title: "Full Checkers Rules", desc: "Mandatory jumps, chain multi-jumps, king promotion — all standard rules correctly enforced, so you learn the real game." },
  { emoji: "📋", title: "Game History", desc: "Your last 20 games are saved automatically in your browser. See winner, move count, mode, and time for every game." },
  { emoji: "👥", title: "Local 2-Player Mode", desc: "Play with a friend on the same device. No accounts, no sign-up — just open the app and hand over the screen." },
];

const STEPS = [
  { title: "Pick a mode", desc: "Choose 2-player or Easy/Smart AI." },
  { title: "Play with hints", desc: "Click pieces to see legal moves highlighted." },
  { title: "Finish the game", desc: "Capture all enemy pieces or block them." },
  { title: "Read your feedback", desc: "Get personalized coaching tips instantly." },
];

// Mini decorative board for the hero strip (8 cols × 8 rows, transposed)
// ' ' = light square, '.' = dark empty, 'r' = red piece, 'b' = black piece
const BOARD_PREVIEW: string[][] = (() => {
  const B = [
    [" ","b"," ","b"," ","b"," ","b"],
    ["b"," ","b"," ","b"," ","b"," "],
    [" ","b"," ","b"," ","b"," ","b"],
    [" "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "],
    ["r"," ","r"," ","r"," ","r"," "],
    [" ","r"," ","r"," ","r"," ","r"],
    ["r"," ","r"," ","r"," ","r"," "],
  ];
  // Replace empty dark squares
  return B.map((row, r) =>
    row.map((cell, c) => {
      if (cell !== " ") return cell;
      return (r + c) % 2 === 1 ? "." : " ";
    })
  );
})();
