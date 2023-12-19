import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
import styles from "./header.module.css";
import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout,
} from "~/routes/plugin@10auth";
import { useAppURL } from "~/routes/layout";

export default component$(() => (
  <header class={styles.header}>
    <div class={styles.wrapper}>
      <div class={styles.logo}>
        <a href="/" title="qwik">
          <QwikLogo height={50} width={143} />
        </a>
      </div>
      <ul>
        <li>
          <HeaderAuthControl />
        </li>
        <li>
          <a
            href="https://qwik.builder.io/examples/introduction/hello-world/"
            target="_blank"
          >
            Examples
          </a>
        </li>
        <li>
          <a
            href="https://qwik.builder.io/tutorial/welcome/overview/"
            target="_blank"
          >
            Tutorials
          </a>
        </li>
      </ul>
    </div>
  </header>
));

const HeaderAuthControl = component$(() => {
  const session = useAuthSession();
  const user = session.value?.user;
  return (
    <div>
      {user ? (
        <div class={styles.header}>
          <span>{user.email || user.name || "You"}</span>
          <LogoutButton />
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
    console.log("signIn.value?.failed", signIn.value?.failed);
  const callbackUrl = useAppURL("/");
  console.log(callbackUrl);
  return (
    <button
      onClick$={() =>
        signIn.submit({
          // providerId: "email",
          callbackUrl,
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
