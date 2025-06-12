import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "CitiBike Analytics Dashboard | Real-time Data Insights",
  description:
    "Advanced analytics dashboard for CitiBike data with machine learning predictions, anomaly detection, and revenue analysis powered by Snowflake data warehouse.",
  keywords: [
    "CitiBike",
    "Analytics",
    "Dashboard",
    "Machine Learning",
    "Data Analysis",
    "Snowflake",
    "Revenue Prediction",
    "Anomaly Detection",
  ],
  authors: [{ name: "CitiBike Analytics Team" }],
  openGraph: {
    title: "CitiBike Analytics Dashboard",
    description: "Real-time CitiBike data insights with ML-powered analytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CitiBike Analytics Dashboard",
    description: "Real-time CitiBike data insights with ML-powered analytics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
