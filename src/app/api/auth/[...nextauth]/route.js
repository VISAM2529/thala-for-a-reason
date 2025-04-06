// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptionsObject } from "@/lib/auth";

export const GET = NextAuth(authOptionsObject);
export const POST = NextAuth(authOptionsObject);