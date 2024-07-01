"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
