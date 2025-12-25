import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neural Terminal | Portfolio",
  description: "A digital override into the system. Full Stack Engineer, AI Architect, IoT Specialist.",
  keywords: ["portfolio", "software engineer", "full stack", "AI", "IoT", "developer"],
  authors: [{ name: "Kinjal Dutta" }],
  openGraph: {
    title: "Neural Terminal",
    description: "Access classified projects and technical archives",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased bg-[#050505] text-[#E0E0E0]`}
      >
        {/* Noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        
        {children}
      </body>
    </html>
  );
}
