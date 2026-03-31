import { pgTable, serial, varchar, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  address: varchar("address", { length: 200 }),
  variety: varchar("variety", { length: 100 }),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
