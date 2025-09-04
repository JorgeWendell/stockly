import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https:/stockly.adelbr.tech"
      : "http://localhost:3000",
});
