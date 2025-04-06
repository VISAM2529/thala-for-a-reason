import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import { User } from "../models/User";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await dbConnect();
        
        // Check if user already exists in your database
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user if doesn't exist
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            password: "", // Not needed for Google login
          });
          
          // Update the user object with the MongoDB _id
          user.id = newUser._id.toString();
        } else {
          // Use existing user's _id
          user.id = existingUser._id.toString();
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // Persist the user.id from the signIn callback to the JWT
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Send the MongoDB _id to the client
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const authOptionsObject = authOptions;
export default NextAuth(authOptions);