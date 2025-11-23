import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiContext } from "@/context/wagmiContext";
import { ConnectContext } from "@/context/connectContext";

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
    imageUrl: "https://wrapped-ggc-farcaster-mint-app.vercel.app/opengraph-image.png",
    button: {
      title: "Invest in Gold w/ WrappedGGC",
      action: {
        type: "launch_miniapp",
        url: "https://wrapped-ggc-farcaster-mint-app.vercel.app",
        name:"Wrapped GGC",
        splashImageUrl: "https://wrapped-ggc-farcaster-mint-app.vercel.app/icons/rounded_logo.png",
        splashBackgroundColor:"#ffffff"
      }
    }
  }

  return (
    <html lang="en">
      <head>
        <meta 
        property="og:image" 
          content="https://wrapped-ggc-farcaster-mint-app.vercel.app/opengraph-image.png" 
        />
        <meta 
          name="fc:miniapp"
          content={JSON.stringify(miniApp)} 
        />
      </head>
      <body
        className={`${geistMono.className}`}
      >
        <WagmiContext>
          <ConnectContext>
            {children}
          </ConnectContext>
        </WagmiContext>
      </body>
    </html>
  );
}
