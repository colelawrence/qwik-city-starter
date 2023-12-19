import { migrate } from "drizzle-orm/postgres-js/migrator";
import { ServerCtx } from "./ServerCtx";

export async function drizzleMigrate(ctx: ServerCtx) {
  const db = ctx.drizzle(ctx.getLogger("drizzle-migrate"));
  await migrate(db, { migrationsFolder: "drizzle" });
}
