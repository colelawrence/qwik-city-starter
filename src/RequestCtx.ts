import type { ILogger } from "@autoplay/workerlog";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { ServerCtx } from "./ServerCtx";
import type * as schema from "./drizzle-schema";
import type { DisposePool } from "./utils/DisposePool";

export class RequestCtx {
  constructor(
    private config: {
      logger: ILogger;
      server: ServerCtx;
      traceID: string;
      /** Open for the duration of the request */
      pool: DisposePool;
    },
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
