import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

// Display Font - Sora (geometric, modern, distinctive)
// Alternative to Clash Display that's available on Google Fonts
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Body Font - Outfit (clean, modern, distinctive alternative to Inter)
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Monospace Font - JetBrains Mono (for transcripts and technical data)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PhishMirror | AI-Powered Scam Protection",
  description: "Real-time scam detection and call interception powered by Teli AI",
  keywords: ["scam protection", "call screening", "AI security", "fraud detection"],
  authors: [{ name: "PhishMirror Team" }],
  openGraph: {
    title: "PhishMirror | AI-Powered Scam Protection",
    description: "Real-time scam detection and call interception powered by Teli AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
