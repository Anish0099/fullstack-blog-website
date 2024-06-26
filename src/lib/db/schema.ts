import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const $posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id").notNull(),
});

export type postType = typeof $posts.$inferInsert;