import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";

import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  display: 'swap',
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: "فؤاد جيم | اصنع أسطورتك",
  description: "نظام إدارة رياضي متكامل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <body className={`${cairo.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
