import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./drizzle-schema";
import { ILogger } from "@autoplay/workerlog";
import { DisposePool } from "./utils/DisposePool";
import { ServerCtx } from "./ServerCtx";

export class RequestCtx {
  constructor(
    private config: {
      logger: ILogger;
      server: ServerCtx;
      traceID: string;
      /** Open for the duration of the request */
      pool: DisposePool;
    }
  ) {}
  /** Opened connections may be disposed at the end of the request */
  drizzle(logger: ILogger): PostgresJsDatabase<typeof schema> {
    const sql = this.config.server.connectToDatabase(this.config.pool);
    return this.config.server.drizzle(logger, sql);
  }
  getLogger(name: string, key?: string | number | undefined) {
    return this.config.logger.named(name, key);
  }
}
