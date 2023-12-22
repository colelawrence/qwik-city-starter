import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Form, routeAction$, z } from "@builder.io/qwik-city";
import { File } from "buffer";
import { RouterHead } from "~/components/router-head/router-head";
import { models } from "~/model/model-tables-schema";
import { useAppURL } from "~/routes/layout";
import { getRequestCtx } from "~/routes/plugin@01requestCtx";
import { authorizedUser } from "~/routes/plugin@10auth";
import formStyles from "~/styles/form.module.css";
import { generateID } from "~/utils/generateID";

export const useFormAction = routeAction$(async (form, request) => {
  const bodyType = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string(),
    model_json_file: z
      // Hmm: Oddly, this is not a File type, but a string when JavaScript is disabled on the browser
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
  const modelsBaseURL = useAppURL("/model/");
  // const nav = useNavigate();

  return action.value?.success ? (
    <>
      <RouterHead>
        <title>Model created</title>
        <meta
          http-equiv="refresh"
          content={`0; url=${modelsBaseURL + action.value.id + "/"}`}
        />
      </RouterHead>
      <div>
        <h1>Model created</h1>
      </div>
    </>
  ) : (
    <Form action={action} class={[formStyles.form, "max-w-sm mx-auto mb-20"]}>
      <div class={formStyles.field}>
        <label for="title" class={formStyles.label}>
          Title
        </label>
        <input
          type="text"
          name="title"
          value={action.value?.form?.title as string | undefined}
          class={formStyles.input}
        />
        <ErrorText error={action.value?.error?.title} />
      </div>
      <div class={formStyles.field}>
        <label for="description" class={formStyles.label}>
          Description
        </label>
        <textarea
          name="description"
          value={action.value?.form?.["description"] as string | undefined}
          class={formStyles.input}
        />
        <ErrorText error={action.value?.error?.description} />
      </div>
      <div class={formStyles.field}>
        <label for="model_json_file" class={formStyles.label}>
          Model JSON
        </label>
        {/* Json file */}
        <input type="file" name="model_json_file" class={formStyles.input} />
        <ErrorText error={action.value?.error?.model_json_file} />
      </div>
      <div class="flex items-center justify-between">
        <input
          type="submit"
          disabled={action.isRunning}
          class={formStyles.button}
        />
      </div>
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
        <div class={formStyles.errorHelp}>
          {props.error._errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      );
    }

    return null;
  },
);
