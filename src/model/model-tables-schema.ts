import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { authUsers } from "~/drizzle-schema";

/** Structure is initially informed by the needs of being an Auth.js adapter */
export const models = pgTable("models", {
  id: text("id").notNull().primaryKey(),
  title: text("title"),
  description: text("description"),
  model_json: jsonb("model_json"),
  author: text("author_user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
});
