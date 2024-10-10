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

  const session = await auth();

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
        <div className={styles.clouds}>
          <div className={styles.cloud1}>
            <div className={`${styles.cloud} ${styles['cloud-back']}`}></div>
            <div className={`${styles.cloud} ${styles['cloud-mid']}`}></div>
            <div className={`${styles.cloud} ${styles['cloud-front']}`}></div>
          </div>
          <div className={styles.cloud2}>
            <div className={`${styles.cloud} ${styles['cloud-back']}`}></div>
            <div className={`${styles.cloud} ${styles['cloud-mid']}`}></div>
            <div className={`${styles.cloud} ${styles['cloud-front']}`}></div>
          </div>
        </div>
        <nav className="flex absolute top-2 left-4">
          <Link href="/" className="hover:text-teal-500 hover:cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
          </Link>
        </nav>
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
