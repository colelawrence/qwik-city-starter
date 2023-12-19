import { type RequestHandler } from "@builder.io/qwik-city";
import { DisposePool } from "~/utils/DisposePool";

const DISPOSEPOOL_SHARED_MAP_KEY = "dispose-pool";

export const onRequest: RequestHandler = async ({ next, sharedMap }) => {
  const pool = new DisposePool();
  sharedMap.set(DISPOSEPOOL_SHARED_MAP_KEY, pool);
  try {
    await next();
    pool.dispose();
  } catch (err) {
    pool.dispose();
    throw err;
  }
};

export const loadRequestDisposePool = (sharedMap: Map<string, unknown>) => {
  return sharedMap.get(DISPOSEPOOL_SHARED_MAP_KEY) as DisposePool;
};
