import type { ILogger } from "@autoplay/workerlog";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { loadRequestCtx } from "./plugin@01requestCtx";

const REQUEST_WARNING_THRESHOLD = 400;

export const onRequest: RequestHandler = async ({
  next,
  url,
  method,
  sharedMap,
  status,
  headers,
}) => {
  const ctx = loadRequestCtx(sharedMap);
  // could use performance.now for sub-millisecond accuracy, but we're keeping it simple
  const startAt = Date.now();
  const log = ctx.getLogger("public-request");
  const warning = setTimeout(() => {
    log.warn("request is taking a long time to respond", attrs);
  }, REQUEST_WARNING_THRESHOLD);
  let caughtError: unknown;
  const attrs: Record<string, unknown> = {
    http: {
      method,
      host: url.host,
      path: url.pathname,
      query: url.search,
    },
  };
  try {
    await next();
  } catch (err) {
    const statusCode = status();
    if (statusCode >= 500) {
      attrs.err = err;
    } else if (statusCode >= 400) {
      attrs.err = err instanceof Error ? err.message : err;
    }
  } finally {
    clearTimeout(warning);
    const statusCode = status();

    // set various attributes
    attrs["http.status"] = statusCode;
    attrs.dur = Date.now() - startAt;
    if (statusCode >= 400) {
      // attrs["..."] = headers.get("...");
    } else if (statusCode >= 300) {
      attrs["response.headers.location"] = headers.get("location");
    }

    // log out severity based on status
    if (statusCode >= 500) {
      log.error("request failed", attrs);
    } else if (statusCode >= 400) {
      log.warn("request incomplete", attrs);
    } else {
      log.debug("request complete", attrs);
    }

    if (caughtError) {
      throw caughtError;
    }
  }
};

const useRequestContextLoader = routeLoader$(({ sharedMap }) => {
  return loadRequestCtx(sharedMap);
});

export function useRequestLogger(name: string, key?: string | number): ILogger {
  return useRequestContextLoader().value.getLogger(name, key);
}
