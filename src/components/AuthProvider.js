// src/components/AuthProvider.jsx
"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}