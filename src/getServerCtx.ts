import { ServerCtx } from "./ServerCtx";
import {
  WorkerLoggerLevel,
  createWorkerLoggerProvider,
} from "@autoplay/workerlog";

let ctx: ServerCtx | undefined;

export function getServerCtx(): ServerCtx {
  if (!ctx) {
    const provider = createWorkerLoggerProvider({ console });
    provider.configureLogging({
      min: WorkerLoggerLevel.TRACE,
    })
    ctx = new ServerCtx({
      logger: provider.getLogger(),
      maxPgConnections: 3,
    });
  }

  return ctx;
}
