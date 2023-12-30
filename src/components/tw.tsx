// Trying to keep in sync with https://gist.github.com/colelawrence/60ebf46b09c738e2e3cfe80a6e52d9c0
import { Slot, component$ } from "@builder.io/qwik";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import { twMerge } from "tailwind-merge";

/** Comes from {@link tw} template. */
type TwString = string & {
  _tw: true;
};

/** This applies types to something like `tw.div` or `tw.h1`, which will leverage the types from `JSX.IntrinsicElements` */
type TwIntrinsicTagVariant = {
  [P in keyof JSX.IntrinsicElements]: <
    V extends Record<
      string,
      { base: TwString } & Record<string, TwString>
    > = {},
  >(
    template: TwString,
    vars?: V,
  ) => (
    props: JSX.IntrinsicElements[P] & {
      [P in keyof V]?: keyof V[P];
    },
  ) => JSX.Element;
};

export const tw = new Proxy(
  ((template: TemplateStringsArray) => String.raw(template) as TwString) as ((
    template: TemplateStringsArray,
  ) => TwString) &
    TwIntrinsicTagVariant,
  {
    get(target, tag) {
      if (typeof tag !== "string")
        throw new Error(`tw[${tag.toString()}] must not be a symbol`);
      return twtagged.bind(null, tag);
    },
  },
);

function twtagged(
  Tag: string,
  base: TwString,
  variants: Record<string, Record<string, TwString>>,
) {
  const component = component$(
    ({ class: ogclass, _twJSXDev, ...props }: any) => {
      const tws = [base];
      for (const variant in variants) {
        const use = props[variant] ?? "base";
        const tw = variants[variant][use];
        if (!tw) {
          throw new Error(
            `No variant ${variant} with ${use} used with component type <${Tag}/>`,
          );
        }
        tws.push(tw);
      }

      if (_twJSXDev) {
        props["data-qwik-inspector"] =
          `${_twJSXDev.fileName}:${_twJSXDev.lineNumber}:${_twJSXDev.columnNumber}`;
      }

      return (
        <Tag {...props} class={[twMerge(tws), ogclass]}>
          <Slot />
        </Tag>
      );
    },
  );

  return new Proxy(component, {
    apply: (target, thisArg, args) => {
      args[0]._twJSXDev = args?.[3];
      return target.apply(thisArg, args as any);
    },
  });
}
