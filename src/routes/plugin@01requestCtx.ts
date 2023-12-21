import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import { RequestCtx } from "~/RequestCtx";
import { ServerCtx } from "~/ServerCtx";
import { generateID } from "~/utils/generateID";
import { loadRequestDisposePool } from "./plugin@00requestDisposePool";

const REQUEST_CTX_SHARED_MAP_KEY = "reqctx";

export const onRequest: RequestHandler = async ({ next, sharedMap, env }) => {
  const server = new ServerCtx({
    env,
    maxPgConnections: 1,
  });
  // TODO: replace with an Otel traceId
  const traceID = generateID("T");
  const reqctx = new RequestCtx({
    logger: server.getLogger("trace.id", traceID),
    traceID,
    pool: loadRequestDisposePool(sharedMap),
    server,
  });
  sharedMap.set(REQUEST_CTX_SHARED_MAP_KEY, reqctx);
  await next();
};

export const loadRequestCtx = (sharedMap: Map<string, unknown>) => {
  return sharedMap.get(REQUEST_CTX_SHARED_MAP_KEY) as RequestCtx;
};

export const useRequestCtx = routeLoader$(({ sharedMap }) =>
  loadRequestCtx(sharedMap),
);
