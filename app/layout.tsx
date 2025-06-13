import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "./NavBar";
import Image from 'next/image'
import "./globals.css";
import FooterPage from "./components/Footer";
import {Theme} from "@radix-ui/themes";
import { Providers } from './providers';
import Layout from './components/layout/Layout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],});

export const metadata: Metadata = {
  title: 'Tax Tracker - Business Register Application',
  description: 'A comprehensive business register application for local council tax management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        
      >
        <Providers>
          <Theme>
            <NavBar />
            <Image src='/dgi-banner-fr.jpg' alt='dgi-banner' width={10000} height={100} />
            <Layout>
              <main>
                {children}
              </main>
            </Layout>
            <FooterPage />
          </Theme>
        </Providers>
      </body>
    </html>
  );
}
