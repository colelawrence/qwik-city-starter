import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { builderDevTools } from "@builder.io/dev-tools/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";

export default defineConfig(() => {
  return {
    plugins: [builderDevTools(), qwikCity(), qwikVite(), tsconfigPaths(), ...eslintPlugins],
    server: {
      port: 5180,
    },
    dev: {
      headers: {
        'Cache-Control': 'public, max-age=0',
      },
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    optimizeDeps: { include: [
      // See https://qwik.builder.io/docs/integrations/authjs/
      '@auth/core'
    ] }
  };
});


const eslintPlugins = [
  { // default settings on build (i.e. fail on error)
    ...eslint(),
    apply: 'build',
  },
  { // do not fail on serve (i.e. local development)
    ...eslint({
      failOnWarning: false,
      failOnError: false,
    }),
    apply: 'serve',
    enforce: 'post'
  }
]