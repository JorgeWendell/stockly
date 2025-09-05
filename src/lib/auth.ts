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
    sendResetPassword: async () => {
      // Função vazia para evitar callbacks externos
    },
    sendVerificationEmail: async () => {
      // Função vazia para evitar callbacks externos
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://192.168.15.32:3000",
    "http://stockly.adelbr.tech:3001",
    "https://stockly.adelbr.tech:3001", // HTTPS também
  ],
  baseURL: "http://stockly.adelbr.tech:3001", // URL fixa para produção
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
  // Configuração específica para evitar URLs externas
  callbacks: {
    session: {
      create: async (session) => {
        return session;
      },
    },
  },
  // Configuração específica para evitar URLs externas
  plugins: [],
  // Configuração específica para evitar URLs externas
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
  // Configuração específica para evitar URLs externas
  logger: {
    level: "debug",
  },
  // Configuração específica para evitar URLs externas
  experimental: {
    enableWebAuthn: false,
  },
  // Configuração específica para evitar URLs externas
  socialProviders: {
    google: {
      clientId: "",
      clientSecret: "",
    },
  },
  // Configuração específica para evitar URLs externas
  rateLimit: {
    window: 60,
    max: 100,
  },
  // Configuração específica para evitar URLs externas
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  // Configuração específica para evitar URLs externas
  cookies: {
    sessionToken: {
      name: "better-auth.session-token",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  // Configuração específica para evitar URLs externas
  pages: {
    signIn: "/login",
    signUp: "/login",
    error: "/login",
  },
  // Configuração específica para evitar URLs externas
  theme: {
    colorScheme: "light",
  },
  // Configuração específica para evitar URLs externas
  debug: true,
  // Configuração específica para evitar URLs externas
  generateId: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateSessionId: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateVerificationToken: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generatePasswordResetToken: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateEmailVerificationToken: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateMagicLinkToken: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateOAuthState: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generatePKCEVerifier: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generatePKCEChallenge: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateWebAuthnChallenge: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateWebAuthnCredentialId: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateWebAuthnUserId: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateWebAuthnChallengeId: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateWebAuthnChallengeValue: () => crypto.randomUUID(),
  // Configuração específica para evitar URLs externas
  generateWebAuthnChallengeExpiresAt: () =>
    new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
});
