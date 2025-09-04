import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http:/stockly.adelbr.tech"
      : "http://localhost:3000",
});
