import { migrate } from "drizzle-orm/postgres-js/migrator";
import { ServerCtx } from "./ServerCtx";
import { DisposePool } from "./utils/DisposePool";

export async function drizzleMigrate(ctx: ServerCtx) {
  const pool = new DisposePool();
  const sql = ctx.connectToDatabase(pool);
  await migrate(ctx.drizzle(ctx.getLogger("drizzle-migrate"), sql), {
    migrationsFolder: "src/drizzle",
  });
  pool.dispose();
}
