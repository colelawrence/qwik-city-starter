import { ServerCtx } from "~/ServerCtx";
import { drizzleMigrate } from "~/drizzleMigrate";
import { nodejsEnvGetter } from "~/utils/nodejsEnvGetter";

await drizzleMigrate(
  new ServerCtx({
    env: nodejsEnvGetter,
    maxPgConnections: 1,
  })
);
