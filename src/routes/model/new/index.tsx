import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Form, routeAction$, useNavigate, z } from "@builder.io/qwik-city";
import { File } from "buffer";
import { models } from "~/model/model-tables-schema";
import { getRequestCtx } from "~/routes/plugin@01requestCtx";
import { authorizedUser } from "~/routes/plugin@10auth";
import { generateID } from "~/utils/generateID";
import formStyles from "./form.module.css";

export const useFormAction = routeAction$(async (form, request) => {
  const bodyType = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string(),
    model_json_file: z
      .instanceof(File)
      .refine(
        (file) => file.type === "application/json",
        "Must upload a JSON file",
      )
      .refine((file) => file.size < 5_000_000, "Upload must be less than 5MB")
      .transform((file) => file.text())
      .transform((json) => JSON.parse(json))
      .refine(
        (json) => json && typeof json === "object",
        "Upload must be a valid JSON file",
      ),
  });
  const user = authorizedUser(request);
  const req = getRequestCtx(request);
  const logger = req.getLogger("new model");
  logger.debug("creating a new model", { form, user });

  const bodyParsed = await bodyType.safeParseAsync(form);

  if (!bodyParsed.success) {
    request.status(400);
    return {
      success: false,
      error: bodyParsed.error.format(),
      form: {
        title: form.title,
        description: form.description,
      },
    };
  }

  logger.debug("inserting for", { user, model: bodyParsed.data });
  const [{ id }] = await req
    .drizzle(logger)
    .insert(models)
    .values({
      id: generateID("M"),
      author: user.id,
      title: bodyParsed.data.title,
      description: bodyParsed.data.description,
      model_json: bodyParsed.data.model_json_file,
    })
    .returning({ id: models.id });

  request.status(201);
  return {
    success: true,
    id,
  };
});

export const onRequest: RequestHandler = (request) => {
  authorizedUser(request);
};

export default component$(() => {
  const action = useFormAction();
  const nav = useNavigate();
  useVisibleTask$(({ track }) => {
    const actioned = track(action);
    if (actioned?.success) {
      nav(`/model/${actioned.id}/`);
    }
  });

  return action.value?.success ? (
    <div class="flex flex-col items-center">
      <p>Model created</p>
      <p>
        <a href={`/model/${action.value.id}/`}>View model</a>
      </p>
    </div>
  ) : (
    <Form action={action} class={formStyles.form}>
      <div class={formStyles.field}>
        <label for="title">Title</label>
        <input
          type="text"
          name="title"
          value={action.value?.form?.title as string | undefined}
        />
        <ErrorText error={action.value?.error?.title} />
      </div>
      <div class={formStyles.field}>
        <label for="description">Description</label>
        <textarea
          name="description"
          value={action.value?.form?.["description"] as string | undefined}
        />
        <ErrorText error={action.value?.error?.description} />
      </div>
      <div class={formStyles.field}>
        <label for="model_json_file">Model JSON</label>
        {/* Json file */}
        <input type="file" name="model_json_file" />
        <ErrorText error={action.value?.error?.model_json_file} />
      </div>
      <input type="submit" disabled={action.isRunning} />
      <ErrorText error={action.value?.error} />
    </Form>
  );
});

const ErrorText = component$(
  (props: {
    error:
      | {
          _errors: string[];
        }
      | undefined;
  }) => {
    if (props.error?._errors.length) {
      return (
        <div class="p-1 bg-red-950 text-red-300 rounded-sm">
          {props.error._errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      );
    }

    return null;
  },
);