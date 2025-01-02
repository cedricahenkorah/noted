import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { ZodError } from "zod";
import axios from "axios";

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        try {
          let user = null;

          if (!credentials) {
            throw new Error("Please provide email and password.");
          }

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const response = await axios.post(`${uri}/api/auth/email-auth`, {
            email,
            password,
          });

          user = {
            id: response?.data?.data?.user?._id as string,
            name: response?.data?.data?.user?.name,
            email: response?.data?.data?.user?.email,
            image: response?.data?.data?.user?.displayPhoto,
          };

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error("Invalid credentials format.");
          }

          if (axios.isAxiosError(error)) {
            throw new Error(
              error.response?.data?.message || "Authentication failed."
            );
          }

          throw new Error("Unexpected error during authentication.");
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/",
  },

  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
