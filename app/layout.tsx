import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner";
import AIAssistant from "@/components/AIAssistant";

// fonts 
const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "iBuildApps - Share Your Creations, Discover New Launches",
  description: "A community platform for creators to showcase their apps, AI tools, SaaS products, creative projects Authentic launches, real builders, genuine feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${outfit.className} antialiased`}
        >
          <Header />
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
          <AIAssistant />
        </body>
      </html>
    </ClerkProvider>
  );
}
