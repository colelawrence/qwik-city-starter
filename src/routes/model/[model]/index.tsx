import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { models } from "~/drizzle-schema";
import { getRequestCtx } from "~/routes/plugin@01requestCtx";
import { getSession } from "~/routes/plugin@10auth";
import styles from "./model.module.css";

export const useModel = routeLoader$(async (request) => {
  const modelId = request.params.model;
  const userId = getSession(request)?.user?.id;

  const ctx = getRequestCtx(request);
  const logger = ctx.getLogger("model", modelId);
  const results = await ctx
    .drizzle(logger)
    .select()
    .from(models)
    .where(eq(models.id, modelId))
    .limit(1);

  if (results.length === 0) {
    throw request.error(404, "Not found");
  }

  const [model] = results;

  return {
    editable: model.author === userId,
    model,
  };
});

export default component$(() => {
  const model = useModel();
  return (
    <>
      <h1 class={styles.title}>
        {model.value.model.title || <span class="opacity-40">Untitled</span>}
      </h1>
      <p>{model.value.model.description}</p>
      <pre>{JSON.stringify(model.value.model.model_json, null, 2)}</pre>
    </>
  );
});
