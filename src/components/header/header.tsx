import { component$ } from "@builder.io/qwik";
import { useAppURL } from "~/routes/layout";
import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout,
} from "~/routes/plugin@10auth";
import { QwikLogo } from "../icons/qwik";
import styles from "./header.module.css";

export default component$(() => (
  <header class={styles.header}>
    <div class={styles.wrapper}>
      <div class={styles.logo}>
        <a href="/" title="qwik">
          <QwikLogo height={50} width={143} />
        </a>
      </div>
      <HeaderAuthControl />
    </div>
  </header>
));

const HeaderAuthControl = component$(() => {
  const session = useAuthSession();
  const user = session.value?.user;
  return (
    <div class="flex items-center">
      {user ? (
        <div class="flex gap-2">
          <span>{user.email || user.name || "You"}</span>
          <LogoutButton />
          <a href="/model/new/">Add Model</a>
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  );
});

const LoginButton = component$(() => {
  const signIn = useAuthSignin();
  signIn.value?.failed &&
    console.log("signIn.value?.failed", signIn.value.failed);
  const callbackUrl = useAppURL("/");
  console.log(callbackUrl);
  return (
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick$={() =>
        signIn.submit({
          // providerId: "email",
          options: { callbackUrl },
        })
      }
    >
      Sign In
    </button>
  );
});

const LogoutButton = component$(() => {
  const signOut = useAuthSignout();
  // const callbackUrl = useAppURL("/");
  return (
    <button
      onClick$={() =>
        signOut.submit({}).catch((err) => {
          console.error("signOut", err);
        })
      }
    >
      Sign Out
    </button>
  );
});
