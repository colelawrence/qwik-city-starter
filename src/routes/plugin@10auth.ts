import type { Provider } from "@auth/core/providers";
import type { Session, User } from "@auth/core/types";
import { serverAuth$ } from "@builder.io/qwik-auth";
import { type RequestEventCommon } from "@builder.io/qwik-city";
import type { RedirectMessage } from "@builder.io/qwik-city/middleware/request-handler";
import { authPgDrizzleAdapter } from "~/auth/authPgDrizzleAdapter";
import { expectEnvVar } from "~/expectEnvVar";
import { createEmailAuthProvider } from "../auth/createEmailAuthProvider";
import { getRequestCtx } from "./plugin@01requestCtx";

/** Intended to be used in a throw like `throw redirectToSignin(request)` */
export function redirectToSignin({
  url,
  redirect,
}: RequestEventCommon): RedirectMessage {
  return redirect(302, `/api/auth/signin?callbackUrl=${url.pathname}`);
}

export function authorizedUser(req: RequestEventCommon): User {
  const session = getSession(req);
  if (!session || new Date(session.expires).getTime() < Date.now()) {
    throw redirectToSignin(req);
  }
  if (!session.user?.id) {
    throw redirectToSignin(req);
  }
  return session.user;
}
export function getSession(req: RequestEventCommon) {
  if (!req.sharedMap.has("session")) {
    throw req.error(500, "Expected session to be set by other middleware");
  }
  return req.sharedMap.get("session") as Session | null;
}

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$((request) => {
    const { env } = request;
    const ctx = getRequestCtx(request);
    const logger = ctx.getLogger("auth");
    return {
      secret: expectEnvVar(
        env,
        "AUTH_SECRET",
        "random string used to hash tokens, sign cookies and generate cryptographic keys",
      ),
      trustHost: true,
      callbacks: {
        session(params) {
          return {
            ...params.session,
            // re-expose id on the user as well so we can validate shit
            user: params.user,
          };
        },
      },
      // @autoplay/workerlog happens to work with the expected types
      logger: {
        debug(message, metadata) {
          logger.debug("auth.js debug", { message, metadata });
        },
        error(error) {
          logger.error("auth.js error", error);
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
