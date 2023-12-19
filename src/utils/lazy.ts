const LAZY_INIT = Symbol("LAZY_INIT");
export function lazy<T>(fn: () => T): () => T {
  let value: T | typeof LAZY_INIT = LAZY_INIT;
  return () => {
    if (value === LAZY_INIT) {
      value = fn();
    }
    return value;
  };
}
