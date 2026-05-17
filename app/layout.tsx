import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Checkers Coach — Learn Checkers the Smart Way",
  description:
    "Play checkers with move hints, face AI opponents, and get personalized coaching tips after every game.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
