import { ILogger } from "@autoplay/workerlog";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { getServerCtx } from "~/getServerCtx";
import { lazy } from "~/utils/lazy";
import { generateID } from "~/utils/generateID";

const logger = lazy(() => getServerCtx().getLogger("qwik-city"));
const REQUEST_WARNING_THRESHOLD = 400;
const LOGGER_SHARED_MAP_KEY = "http-logging";

export const onRequest: RequestHandler = async ({
  next,
  url,
  method,
  sharedMap,
  status,
}) => {
  // could use performance.now for sub-millisecond accuracy, but we're keeping it simple
  const startAt = Date.now();
  // TODO: replace with an Otel traceId
  const traceID = generateID("T");
  const http = {
    method,
    host: url.host,
    path: url.pathname,
    query: url.search,
  };
  const log = logger().named("trace.id", traceID).with({
    traceID,
  });
  sharedMap.set(LOGGER_SHARED_MAP_KEY, log);
  const warning = setTimeout(() => {
    log.warn("request is taking a long time to respond", { http });
  }, REQUEST_WARNING_THRESHOLD);
  try {
    await next();
    clearTimeout(warning);
    log.debug("request completed", {
      http,
      "http.status": status(),
      dur: Date.now() - startAt,
    });
  } catch (err) {
    clearTimeout(warning);
    log.error("request failed", {
      err,
      http,
      dur: Date.now() - startAt,
    });
    throw err;
  }
};

const useServerLoggerLoader = routeLoader$(({ sharedMap }) => {
  return sharedMap.get(LOGGER_SHARED_MAP_KEY) as ILogger;
});

export function useServerLogger(name: string, key?: string | number): ILogger {
  return useServerLoggerLoader().value.named(name, key);
}
