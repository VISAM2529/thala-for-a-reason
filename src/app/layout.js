"use client"
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { AuthProvider } from "@/components/AuthProvider";

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

// Metadata export
// export const metadata = {
//   title: "Thala For A Reason",
//   description:
//     "Join the waitlist for Thala For A Reason — the ultimate meme app dedicated to MS Dhoni and the legendary number 7. Stay tuned for updates!",
//   keywords: [
//     "Thala For A Reason",
//     "MS Dhoni",
//     "Thala",
//     "Meme App",
//     "Number 7",
//     "Cricket",
//     "Waitlist",
//     "Dhoni Fans",
//     "India",
//     "Mahi",
//   ],
//   authors: [{ name: "Team Thala", url: "https://thala-for-a-reason.in" }],
//   creator: "Team Thala",
//   metadataBase: new URL("https://thala-for-a-reason.in"),
//   openGraph: {
//     title: "Thala For A Reason",
//     description:
//       "The ultimate meme experience for every MS Dhoni fan. Join the waitlist now and get ready to celebrate Thala-style!",
//     url: "https://thala-for-a-reason.in",
//     siteName: "Thala For A Reason",
//     images: [
//       {
//         url: "https://thala-for-a-reason.in/og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Thala For A Reason - MS Dhoni Meme App",
//       },
//     ],
//     locale: "en_IN",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Thala For A Reason",
//     description:
//       "Celebrate MS Dhoni with the ultimate meme app. Join the waitlist now!",
//     site: "", // optional Twitter handle
//     creator: "",
//     images: ["https://thala-for-a-reason.in/og-image.jpg"],
//   },
// };

// Root Layout - Client Component
export default function RootLayout({ children }) {
  // Need to use client component instead of just useState here
  // This is a simplified example - in a real app you would use a Client Component wrapper
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable}`}>
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2101340679206874"
     crossorigin="anonymous"></script>
      </head>
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main Content Area */}
        <div className="flex flex-col min-h-screen">
          {/* Navbar with hamburger menu */}
          <Navbar toggleSidebar={toggleSidebar} />
          
          {/* Main Content - Add padding-top to account for fixed navbar */}
          <main className="flex-1 pt-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
          
          {/* Optional Footer */}
          <footer className="bg-gray-900 text-white py-6 px-4">
            <div className="container mx-auto text-center">
              <p>© 2025 Thala For A Reason. All rights reserved.</p>
            </div>
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}