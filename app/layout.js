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

export const metadata = {
  title: "Cocopah CRM",
  description: "Cocopah CRM",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/cocopah.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/cocopah.png',
  },
};

export default function RootLayout({ children }) {
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
