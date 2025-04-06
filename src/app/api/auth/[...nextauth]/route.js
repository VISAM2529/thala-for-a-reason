// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptionsObject } from "@/lib/auth";

const handler = NextAuth(authOptionsObject);

export { handler as GET, handler as POST };
