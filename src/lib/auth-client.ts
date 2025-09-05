import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://stockly.adelbr.tech:3001", // URL fixa para produção
});
