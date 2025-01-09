import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: false,
  // adapter: PrismaAdapter(prisma),
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    // authorized({ auth, request: { nextUrl } }:any) {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
    //   console.log("isLoggedIn = ", isLoggedIn)
    //   console.log("isOnDashboard = ", isOnDashboard) 
    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL("/dashboard", nextUrl));
    //   }
    //   return true;
    // },
    // async redirect({ url, baseUrl }) {
    //   // Customize redirect behavior
    //   if (url.startsWith(baseUrl)) return url
    //   // Redirect to a specific page after successful login
    //   else if (url.startsWith("/")) return `${baseUrl}${url}`
    //   return baseUrl + "/dashboard" // Change this to your desired redirect path
    // }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
