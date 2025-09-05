import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  user: {
    modelName: "UsersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Desabilita verificação por email
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://192.168.15.32:3000",
    "http://stockly.adelbr.tech:3001",
    "https://stockly.adelbr.tech:3001", // HTTPS também
  ],
  baseURL: "http://stockly.adelbr.tech:3001", // URL fixa para produção
});
