# Qwik City, Builder.io starter with Auth.js Email and Drizzle ORM

You might follow the Prisma guide, [Setting up a local PostgreSQL database](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database), for getting PostgreSQL running locally for development.

1. Start up a local PostgreSQL server with matching credentials to the [.env](./.env) conneciton string.

2. Run Drizzle ORM migrations on database

```sh
# Run initial migrations on pg
pnpm db:generate
```

3. Start dev

```sh
# Run dev qwik city server
pnpm dev
```

4. Open https://localhost:5080

## Major dependencies

- Qwik: A resumable UI architecture, designed from the ground-up for speed.
- Qwik-City: "Next.js" equivalent with modern dev tooling and seemless client-server requesting with [`server$`](https://qwik.builder.io/docs/server$/)
- Drizzle: A minimal SQL querying ORM which leverages prepared queries for performance
- PostgreSQL: By far the most widely supported and portable database with incredible performance

# Qwik City App ⚡️

Below is the README that comes with setting up a qwik-city project with builder.

---

- [Qwik Docs](https://qwik.builder.io/)
- [Discord](https://qwik.builder.io/chat)
- [Qwik GitHub](https://github.com/BuilderIO/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.builder.io/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.builder.io/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `pnpm qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.builder.io/qwikcity/guides/static-site-generation/).

```shell
pnpm qwik add # or `pnpm qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `pnpm start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
pnpm preview # or `pnpm preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
pnpm build # or `pnpm build`
```

## Builder.io + Qwik

An example of using [Builder.io's](https://www.builder.io/) visual editor with Qwik.

See the catchall route at [src/routes/[...index]/index.tsx](src/routes/[...index]/index.tsx) for the integration code.

Registered components can be found in [src/components/builder-registry.ts](src/components/builder-registry.ts)

### Docs

See our full integration guides [here](https://www.builder.io/c/docs/developers)

Also, when you push your integration to production, go back and update your preview URL to your production URL so now anyone on your team can visuall create content in your Qwik app!

Also, to integrate structured data, see [this guide](https://www.builder.io/c/docs/integrate-cms-data)
