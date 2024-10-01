'use client'
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
import { signIn, signOut, auth } from "@/auth"
import { useSession, SessionProvider } from "next-auth/react";

const UserComponent = () => {
// export default function UserComponent() {
  const session = useSession();


  async function signin () {
    await signIn('google');
  }

  async function signout () {
    await signOut();
  }

  function SignOut() {
    return (
        <Button onClick={signout}>Sign-out</Button>
    )
  }
  
  function SignIn() {
    return (
      <Button onClick={signin}>Sign-in with Google</Button>
    )
  } 

  return (
    <SessionProvider>
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
                <DropdownMenuItem
                >Profile</DropdownMenuItem>
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
    </SessionProvider>
  );
}

export default UserComponent;