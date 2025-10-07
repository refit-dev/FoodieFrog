import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NextAuthProvider from "@/providers/NextAuthProvider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CartProvider } from "@/context/CartContext";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FoodieFrog - Food Delivery",
  description: "Your favorite food delivery platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavbarWrapper />
              <main className="min-h-screen">{children}</main>
              <FooterWrapper/>
            </ThemeProvider>
          </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
