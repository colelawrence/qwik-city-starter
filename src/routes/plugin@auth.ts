import { serverAuth$ } from "@builder.io/qwik-auth";
import type { Provider } from "@auth/core/providers";
import { createEmailAuthProvider } from "../auth/createEmailAuthProvider";
import { authPgDrizzleAdapter } from "~/auth/authPgDrizzleAdapter";
import { getServerCtx } from "~/getServerCtx";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => {
    const server = getServerCtx();
    const logger = server.getLogger("auth");
    return {
      secret: env.get("AUTH_SECRET"),
      trustHost: true,
      adapter: authPgDrizzleAdapter(server.drizzle(logger)),
      providers: [
        createEmailAuthProvider(logger),
        // GitHub({
        //   clientId: env.get("GITHUB_ID")!,
        //   clientSecret: env.get("GITHUB_SECRET")!,
        // }),
      ] as Provider[],
    };
  });
