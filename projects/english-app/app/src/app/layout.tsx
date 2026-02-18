import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeakRight - 看得见的发音",
  description: "3D mouth visualization for English pronunciation learning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
