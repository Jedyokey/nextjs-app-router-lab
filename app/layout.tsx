import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

// fonts 
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  subsets: ["latin"]
  // variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "iBuiltThis",
  description: "iBuiltThis is a platform for building and sharing your own projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <header>iBuiltThis</header>
        {children}
        <footer>iBuiltThis Inc. All rights reserved.</footer>
      </body>
    </html>
  );
}
