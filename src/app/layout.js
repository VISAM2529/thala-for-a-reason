import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // add or adjust weights as needed
});

// Metadata
export const metadata = {
  title: "Thala For A Reason",
  description:
    "Join the waitlist for Thala For A Reason — the ultimate meme app dedicated to MS Dhoni and the legendary number 7. Stay tuned for updates!",
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
    description:
      "The ultimate meme experience for every MS Dhoni fan. Join the waitlist now and get ready to celebrate Thala-style!",
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
    description:
      "Celebrate MS Dhoni with the ultimate meme app. Join the waitlist now!",
    site: "", // optional Twitter handle
    creator: "",
    images: ["https://thala-for-a-reason.in/og-image.jpg"],
  },
};

// Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
