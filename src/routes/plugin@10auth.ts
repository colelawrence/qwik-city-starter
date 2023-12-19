import { serverAuth$ } from "@builder.io/qwik-auth";
import type { Provider } from "@auth/core/providers";
import { createEmailAuthProvider } from "../auth/createEmailAuthProvider";
import { authPgDrizzleAdapter } from "~/auth/authPgDrizzleAdapter";
import { expectEnvVar } from "~/expectEnvVar";
import { loadRequestCtx } from "./plugin@01requestCtx";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env, sharedMap }) => {
    const ctx = loadRequestCtx(sharedMap);
    const logger = ctx.getLogger("auth");
    return {
      secret: expectEnvVar(
        env,
        "AUTH_SECRET",
        "random string used to hash tokens, sign cookies and generate cryptographic keys"
      ),
      trustHost: true,
      // @autoplay/workerlog happens to work with the expected types
      logger: {
        debug(message, metadata) {
          logger.debug("auth.js debug", { message, metadata });
        },
        error(error) {
          logger.error("auth.js error", {
            error,
            cause: error.cause,
          });
        },
        warn(code) {
          logger.warn("auth.js warning", { code });
        },
      },
      adapter: authPgDrizzleAdapter(ctx.drizzle(logger)),
      providers: [
        createEmailAuthProvider(env, logger),
        // GitHub({
        //   clientId: env.get("GITHUB_ID")!,
        //   clientSecret: env.get("GITHUB_SECRET")!,
        // }),
      ] as Provider[],
    };
  });
