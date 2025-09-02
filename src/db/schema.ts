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

// Tabela de stock
export const StockTable = pgTable("stock", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id),
  nameProduct: varchar("name_product", { length: 255 }).notNull(),
  dateEntry: timestamp("date_entry").notNull().defaultNow(),
  dateExit: timestamp("date_exit"),
  priceInCents: integer("price_in_cents").notNull(),
  depto: departmentEnum("depto").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tipos para TypeScript
export type User = typeof UsersTable.$inferSelect;
export type NewUser = typeof UsersTable.$inferInsert;
export type Stock = typeof StockTable.$inferSelect;
export type NewStock = typeof StockTable.$inferInsert;
