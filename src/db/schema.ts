import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Enum para nível de acesso
export const accessLevelEnum = pgEnum("access_level", [
  "administrativo",
  "diretoria",
  "operador",
]);

// Enum para departamento
export const departmentEnum = pgEnum("department", [
  "cozinha",
  "fabrica",
  "administracao",
  "geral",
]);

// Tabela de login
export const UsersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  accessLevel: accessLevelEnum("access_level").notNull().default("operador"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Tabela de stock
export const StocksTable = pgTable("stocks", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id),
  nameProduct: varchar("name_product", { length: 255 }).notNull(),
  dateEntry: timestamp("date_entry").notNull().defaultNow(),
  dateExit: timestamp("date_exit"),
  priceInCents: integer("price_in_cents").notNull(),
  quantity: integer("quantity").notNull().default(1),
  depto: departmentEnum("depto").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tipos para TypeScript
export type User = typeof UsersTable.$inferSelect;
export type NewUser = typeof UsersTable.$inferInsert;
export type Stock = typeof StocksTable.$inferSelect;
export type NewStock = typeof StocksTable.$inferInsert;
