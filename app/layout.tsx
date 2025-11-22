import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wrapped GGC",
  description: "Virtual Asset backed by the BOG Ghana Gold Coin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const miniApp = {
    version: "next",
    imageUrl: "",
    button: {
      title: "Mint a Wrapped GhanaGoldCoin",
      action: {
        type: "launch_miniapp",
        url: "",
        name:"Wrapped GGC",
        splashImageUrl: "",
        splashBackgroundColor:"#ffffff"
      }
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
