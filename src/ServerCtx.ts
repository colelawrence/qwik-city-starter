import postgres from "postgres";
import { expectEnvVar } from "./expectEnvVar";
import createWorkerLoggerProvider, {
  ILogger,
  IWorkerLoggerProvider,
  WorkerLoggerLevel,
} from "@autoplay/workerlog";
import { DisposePool } from "./utils/DisposePool";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./drizzle-schema";
import { EnvGetter } from "./utils/EnvGetter";

export class ServerCtx {
  #logger: ILogger;
  constructor(
    public config: {
      env: EnvGetter;
      maxPgConnections: number;
    }
  ) {
    const provider = createWorkerLoggerProvider({ console });
    provider.configureLogging({
      min: WorkerLoggerLevel.TRACE,
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
          "connecting to postgres"
        ),
        // HMM: Should we limit the number of connections?
        { max: this.config.maxPgConnections } // defaults to 10
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
