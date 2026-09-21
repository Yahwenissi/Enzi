import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Enzi — Discover Addis Ababa",
  description: "Location-aware discovery platform for Addis Ababa spots",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-display">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}