import type { ILogger } from "@autoplay/workerlog";
import createWorkerLoggerProvider, {
  WorkerLoggerLevel,
} from "@autoplay/workerlog";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle-schema";
import { expectEnvVar } from "./expectEnvVar";
import type { DisposePool } from "./utils/DisposePool";
import type { EnvGetter } from "./utils/EnvGetter";

export class ServerCtx {
  #logger: ILogger;
  constructor(
    public config: {
      env: EnvGetter;
      maxPgConnections: number;
    },
  ) {
    const provider = createWorkerLoggerProvider({ console });
    const level = expectEnvVar(
      config.env,
      "APP_LOG_LEVEL",
      "logging level",
      "trace",
    );
    const minLevel =
      WorkerLoggerLevel[level.toUpperCase() as keyof typeof WorkerLoggerLevel];
    if (minLevel == null) {
      throw new Error(
        `Invalid APP_LOG_LEVEL: ${level}, expected one of ${Object.keys(
          WorkerLoggerLevel,
        ).join(", ")}`,
      );
    }
    provider.configureLogging({
      min: minLevel,
    });
    this.#logger = provider.getLogger();
  }
  #sql: postgres.Sql | undefined;
  #sqlusers = 0;
  getLogger(name: string, key?: string | number | undefined) {
    return this.#logger.named(name, key);
  }
  connectToDatabase(pool: DisposePool): postgres.Sql<{}> {
    if (!this.#sql) {
      this.#sql = postgres(
        expectEnvVar(
          this.config.env,
          "APP_PG_CONNECTION_STRING",
          "connecting to postgres",
        ),
        // HMM: Should we limit the number of connections?
        { max: this.config.maxPgConnections }, // defaults to 10
      );
    }
    this.#sqlusers++;
    pool.addfn(() => {
      this.#sqlusers--;
      if (this.#sqlusers === 0) {
        this.#sql?.end();
        this.#sql = undefined;
      }
    });

    return this.#sql;
  }
  drizzle(logger: ILogger, sql: postgres.Sql<{}>) {
    return drizzle(sql, {
      logger: {
        logQuery(query, params) {
          logger.debug("drizzle-query", { query, params });
        },
      },
      schema,
    });
  }
}
