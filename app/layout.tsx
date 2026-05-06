import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";

const tiemposText = localFont({
  variable: "--font-tiempos-text",
  src: [
    {
      path: "../public/fonts/tt-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-light-italic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/tt-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-regular-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/tt-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-medium-italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/tt-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-semibold-italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/tt-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/tt-bold-italic.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pixl.",
  description: "free movies!?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${tiemposText.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
