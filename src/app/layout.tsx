import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CypherShop - Modern E-Commerce",
  description: "Your ultimate shopping destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 💡 এখানে data-theme="light" দিয়ে DaisyUI এর ডিফল্ট সুন্দর থিম লক করে দেওয়া হলো
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-200/50`}>
        <Navbar />
        <main className="min-h-[calc(100vh-70px)]">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}