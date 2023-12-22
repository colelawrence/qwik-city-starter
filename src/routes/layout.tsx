import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});

export const useAppBaseURL = routeLoader$(({ url }) => {
  url = new URL(url);
  url.pathname = "";
  url.hash = "";
  url.search = "";
  return url.toString();
});

export const useAppURL = (suffix: string) => {
  return useAppBaseURL().value + suffix.replace(/^\//, "");
};
