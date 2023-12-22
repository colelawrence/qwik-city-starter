import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
} from "@builder.io/sdk-qwik";
import { RouterHead } from "~/components/router-head/router-head";
import { expectEnvVar } from "~/expectEnvVar";
import { CUSTOM_COMPONENTS } from "../../components/builder-registry";
import { getRequestCtx } from "../plugin@01requestCtx";

// This page is a catch-all for all routes that don't have a pre-defined route.
// Using a catch-all route allows you to dynamically create new pages in Builder.
// Use the `useBuilderContent` route loader to get your content from Builder.
// `routeLoader$()` takes an async function to fetch content
// from Builder with using `getContent()`.
export const useBuilderProps = routeLoader$(
  async ({ url, status, env, sharedMap }) => {
    const logger = getRequestCtx({ sharedMap }).getLogger("useBuilderProps");
    const isPreviewing = url.searchParams.has("builder.preview");
    const model = "page";
    const apiKey = expectEnvVar(
      env,
      "PUBLIC_BUILDER_API_KEY",
      "for Builder.io props",
    );
    const userAttributes = {
      urlPath: url.pathname,
    };
    // Fetch Builder.io Visual CMS content using the Qwik SDK.
    // The public API key is set in the .env file at the root
    // https://www.builder.io/c/docs/using-your-api-key
    const builderContent = await fetchOneEntry({
      model,
      apiKey,
      options: getBuilderSearchParams(url.searchParams),
      userAttributes,
    });

    // If there's no content, throw a 404.
    // You can use your own 404 component here
    if (!builderContent) {
      logger.warn("builder content for path not found", {
        apiKey,
        model,
        userAttributes,
        isPreviewing,
      });
      status(404);
    } else {
      logger.trace("builder content for path found", {
        apiKey,
        model,
        userAttributes,
        isPreviewing,
        builderContent,
      });
    }

    // return content fetched from Builder, which is JSON
    return {
      apiKey,
      model,
      content: builderContent,
    };
  },
);

export default component$(() => {
  const content = useBuilderProps();
  const { data } = content.value.content ?? {};

  return (
    <>
      {data?.title && (
        <RouterHead>
          <title>{data.title}</title>
        </RouterHead>
      )}
      <Content {...content.value} customComponents={CUSTOM_COMPONENTS} />
    </>
  );
});
