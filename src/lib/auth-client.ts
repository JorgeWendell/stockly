import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://stockly.adelbr.tech:3001"
      : "http://localhost:3000",
});
