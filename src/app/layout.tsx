import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button";
 
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

export const metadata: Metadata = {
  title: "Nabs App",
  description: "Hello, Friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <svg width="0" height="0">
          <filter id="filter-back">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
            />
            <feDisplacementMap in="SourceGraphic" scale="170" />
          </filter>
          <filter id="filter-mid">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.032"
              numOctaves="2"
            />
            <feDisplacementMap in="SourceGraphic" scale="150" />
          </filter>
          <filter id="filter-front">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
            />
            <feDisplacementMap in="SourceGraphic" scale="100" />
          </filter>
        </svg>
        <div className={styles.cloud1}>
          <div className={`${styles.cloud} ${styles['cloud-back']}`}></div>
          <div className={`${styles.cloud} ${styles['cloud-mid']}`}></div>
          <div className={`${styles.cloud} ${styles['cloud-front']}`}></div>
        </div>
        <nav className="flex justify-end">
          <SignIn></SignIn>
        </nav>
        {children}
      </body>
    </html>
  );
}

function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <Button type="submit">Sign-in with Google</Button>
    </form>
  )
} 
