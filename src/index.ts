/**
 * @oniryk/guardion — runtime safety for TypeScript.
 *
 * TypeScript types are erased at runtime. When data crosses a boundary (API,
 * JSON, forms), you hold an `unknown` and type annotations become guesses.
 * `enforce` validates a value against a guard and returns it narrowed — or
 * throws a `GuardianError` pointing to the exact path that failed.
 *
 * The `is` namespace is the vocabulary for describing what a value must look
 * like; `Guard`, `guard`, and `createIs` are the building blocks.
 *
 * @example
 * ```ts
 * import { is, enforce } from "@oniryk/guardion";
 *
 * const user = enforce(data, is.shape({ name: is.string, age: is.int }));
 * ```
 */
export * from "./enforce";
export * from "./guard";
export * from "./primitives";
export * from "./registry";
