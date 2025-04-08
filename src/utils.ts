/* eslint-disable @typescript-eslint/no-explicit-any */

// 🧠 Transform dot notation into nested object
export type DotToNested<T extends string> =
  T extends `${infer Group}.${infer Field}`
    ? { [G in Group]: { [F in Field]: number } }
    : never;

// 🔁 Merge all nested objects into one CombinedSettings
export type Merge<A> = {
  [K in keyof A]: A[K];
};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
