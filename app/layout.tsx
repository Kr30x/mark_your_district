import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const font = localFont({
  src: "./fonts/Inter-Regular.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const fontMono = localFont({
  src: "./fonts/Inter-Regular.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Разметка райнов Москвы",
  description: "Разметка райнов Москвы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.variable} ${fontMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
