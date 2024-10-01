import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";
import { signIn, signOut, auth } from "@/auth"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let session = await auth();
  console.log(session)

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
        <nav className="flex justify-end absolute top-2 right-4">
          {session !== null ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="w-16 h-16 border-2 border-black">
                    <AvatarImage src={session?.user?.image as string}></AvatarImage>
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <SignOut/>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <SignOut/> */}
            </>
          ) : (
            <SignIn />
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}


function SignOut() {
  return (
    <form action = {async () => {
      "use server"
      await signOut()
    }}>
      <Button type="submit">Sign-out</Button>
    </form>
  )
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
