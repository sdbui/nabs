import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'select_account'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) { // fix my types todo
      if (account?.provider === "google") {
        const { name, email } = user;
        try {
          await connectMongoDB();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            const res = await fetch("http://localhost:3000/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
              }),
            });

            if (res.ok) {
              return true;
            }
          }
        } catch (error) {
          console.log(error);
          return false
        }
      }

      return true;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    }
  },


});