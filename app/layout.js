"use client";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import FooterBar from "@/components/footerBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "PixelTight - Image Compressor",
//   description: "Compress and customize your image.",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Define the paths where the Navbar should not appear
  const noNavbarPaths = ["/profile"];

  const showNavbar = !noNavbarPaths.includes(pathname);

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {showNavbar && <Navbar />}
          {children}
          {showNavbar && <FooterBar />}
        </SessionProvider>
      </body>
    </html>
  );
}
