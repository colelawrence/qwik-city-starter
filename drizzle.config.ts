import { defineConfig } from "drizzle-kit";
import { expectEnvVar } from "~/expectEnvVar";
import { nodejsEnvGetter } from "~/utils/nodejsEnvGetter";
export default defineConfig({
  out: "./src/drizzle",
  schema: "./src/drizzle-schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: expectEnvVar(
      nodejsEnvGetter,
      "APP_PG_CONNECTION_STRING",
      "database URL for drizzle config"
    ),
  },
  verbose: true,
  strict: true,
});
