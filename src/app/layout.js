import "./globals.css";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import LayoutClient from "@/components/LayoutClient";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Thala For A Reason",
  description: "Join the waitlist for Thala For A Reason — the ultimate meme app dedicated to MS Dhoni and the legendary number 7.",
  keywords: [
    "Thala For A Reason",
    "MS Dhoni",
    "Thala",
    "Meme App",
    "Number 7",
    "Cricket",
    "Waitlist",
    "Dhoni Fans",
    "India",
    "Mahi",
  ],
  authors: [{ name: "Team Thala", url: "https://thala-for-a-reason.in" }],
  creator: "Team Thala",
  metadataBase: new URL("https://thala-for-a-reason.in"),
  openGraph: {
    title: "Thala For A Reason",
    description: "The ultimate meme experience for every MS Dhoni fan. Join the waitlist now and get ready to celebrate Thala-style!",
    url: "https://thala-for-a-reason.in",
    siteName: "Thala For A Reason",
    images: [
      {
        url: "https://thala-for-a-reason.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thala For A Reason - MS Dhoni Meme App",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thala For A Reason",
    description: "Celebrate MS Dhoni with the ultimate meme app. Join the waitlist now!",
    images: ["https://thala-for-a-reason.in/og-image.jpg"],
  },
  other: {
    "google-adsense-account": "ca-pub-2101340679206874", // 👈 Your code here
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable}`}>
      <head>
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2101340679206874"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-2101340679206874"/>
      </head>
      <body className="bg-gray-100 min-h-screen">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
