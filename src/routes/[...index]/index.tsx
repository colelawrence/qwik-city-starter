import { component$ } from "@builder.io/qwik";
import { DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import {
  getBuilderSearchParams,
  Content,
  fetchBuilderProps,
} from "@builder.io/sdk-qwik";
import { CUSTOM_COMPONENTS } from "../../components/builder-registry";

// This page is a catch-all for all routes that don't have a pre-defined route.
// Using a catch-all route allows you to dynamically create new pages in Builder.

// Use the `useBuilderContent` route loader to get your content from Builder.
// `routeLoader$()` takes an async function to fetch content
// from Builder with using `getContent()`.
export const useBuilderProps = routeLoader$(async ({ url, error }) => {
  const isPreviewing = url.searchParams.has("builder.preview");

  // Fetch Builder.io Visual CMS content using the Qwik SDK.
  // The public API key is set in the .env file at the root
  // https://www.builder.io/c/docs/using-your-api-key
  const builderProps = await fetchBuilderProps({
    model: "page",
    apiKey: import.meta.env.PUBLIC_BUILDER_API_KEY,
    url,
  });

  // If there's no content, throw a 404.
  // You can use your own 404 component here
  if (!builderProps && !isPreviewing) {
    throw error(404, "Page not found");
  }

  // return content fetched from Builder, which is JSON
  return builderProps;
});

export default component$(() => {
  const builderProps = useBuilderProps();

  return (
    <Content {...builderProps.value} customComponents={CUSTOM_COMPONENTS} />
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const builderContent = resolveValue(useBuilderProps);
  return {
    title: builderContent?.data?.title,
  };
};
