import { cookies } from 'next/headers';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { redirect } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// import { useSearchParams } from 'next/navigation';

/**
 * For starters, profile will be a Read of profile 
 * and there are 2 separate views for create and update.
 * Later, /profile will take a query param to determine create or update
 * and getting profile info can probably be put in some modal or something????
 */

export default async function ProfilePage () {
  // middleware ensures there is a session.
  let resp = await fetch('http://localhost:3000/api/profile', {
    method: 'GET',
    headers: { Cookie: cookies().toString() },
  });
  // this is a server component... we probably can just access mongo
  // without the network call?  



  let res = await resp.json();
  // if res is null, no profile found... redirect to create
  if (!res) {
    redirect('/profile/create')
  }
  let profile = res?.data;


  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-screen">
        <Card className="w-fit min-w-[500px] max-w-xl">
          <CardHeader className="flex gap-5 flex-row">
            <CardTitle className="text-3xl">Profile</CardTitle>
            {/* should have an edit button here? */}
            <Link href="/profile/edit" className="hover:text-teal-500 hover:cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </Link>

          </CardHeader>
          <CardContent className="space-y-5">
            <section>
              <p>Selected Content Types</p>
              <ul className="p-2">
                {profile?.blurbTypes?.map((blurbType: string) => (
                  <li className="capitalize" key={blurbType}>{blurbType}</li>
                ))}
              </ul>
            </section>
            
            <section>
              <p>Tags</p>
              <div className="flex gap-2 flex-wrap p-2">
                {profile?.tags?.map((tag: string) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </section>

            <section>
              <p className="">Bio</p>
              <p className="p-2">{profile?.bio}</p>
            </section>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}