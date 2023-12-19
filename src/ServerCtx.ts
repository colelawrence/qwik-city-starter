import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { expectEnvVar } from "./expectEnvVar";
import * as schema from "./drizzle-schema";
import { ILogger } from "@autoplay/workerlog";

export class ServerCtx {
  #sql: postgres.Sql | undefined;
  constructor(
    private config: {
      logger: ILogger;
      maxPgConnections: number;
    }
  ) {}
  get sql() {
    if (!this.#sql) {
      this.#sql = postgres(
        expectEnvVar("APP_PG_CONNECTION_STRING", "connecting to postgres"),
        // HMM: Should we limit the number of connections?
        { max: this.config.maxPgConnections } // defaults to 10
      );
      process.on("beforeExit", () => {
        this.#sql?.end();
        this.#sql = undefined;
      });
    }
    return this.#sql;
  }
  getLogger(name: string, key?: string | number | undefined) {
    return this.config.logger.named(name, key);
  }
  drizzle(logger: ILogger) {
    return drizzle(this.sql, {
      logger: {
        logQuery(query, params) {
          logger.debug("drizzle-query", { query, params });
        },
      },
      schema,
    });
  }
}
