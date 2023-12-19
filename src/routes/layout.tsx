import { component$, Slot } from "@builder.io/qwik";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { routeLoader$ } from "@builder.io/qwik-city";

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
  const baseURL = useAppBaseURL().value;
  console.log("useAppURL", { baseURL, suffix });
  return baseURL + suffix.replace(/^\//, "");
};
