import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Economic Data Table
 * Stores economic indicators for European countries
 */
export const economicData = mysqlTable("economic_data", {
  id: int("id").autoincrement().primaryKey(),
  country: varchar("country", { length: 255 }).notNull(),
  countryCode: varchar("countryCode", { length: 2 }).notNull(),
  indicator: varchar("indicator", { length: 255 }).notNull(),
  indicatorCode: varchar("indicatorCode", { length: 50 }).notNull(),
  year: int("year").notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EconomicData = typeof economicData.$inferSelect;
export type InsertEconomicData = typeof economicData.$inferInsert;

/**
 * AI Analysis Results Table
 * Stores AI-generated analysis of economic data
 */
export const aiAnalysisResults = mysqlTable("ai_analysis_results", {
  id: int("id").autoincrement().primaryKey(),
  analysisType: varchar("analysisType", { length: 50 }).notNull(), // 'overview', 'country', 'indicator'
  targetCode: varchar("targetCode", { length: 50 }), // country code or indicator code
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // JSON stringified analysis
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIAnalysisResult = typeof aiAnalysisResults.$inferSelect;
export type InsertAIAnalysisResult = typeof aiAnalysisResults.$inferInsert;