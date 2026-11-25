import { Guard, simple } from "../guard.js";

/**
 * Checks that a value is a boolean.
 */
export const isBoolean: Guard<boolean> = simple(
  (value) => typeof value === "boolean",
  "boolean"
);

/**
 * Alias for {@link isBoolean}.
 */
export const isBool: Guard<boolean> = isBoolean;

/**
 * Checks that a value is `null`.
 */
export const isNull: Guard<null> = simple((value) => value === null, "null");

/**
 * Checks that a value is `undefined`.
 */
export const isUndefined: Guard<undefined> = simple(
  (value) => value === undefined,
  "undefined"
);

/**
 * Checks that a value is not `null` or `undefined`.
 *
 * @example
 * ```ts
 * is.defined(0);     // true
 * is.defined(null);  // false
 * ```
 */
export const isDefined: Guard<NonNullable<unknown>> = simple<NonNullable<unknown>>(
  (value) => value !== null && value !== undefined,
  "defined value"
);

/**
 * Checks that a value is a non-null, non-array object.
 *
 * Arrays are not objects here — use {@link isArray} for those.
 *
 * @example
 * ```ts
 * is.object({});            // true
 * is.object(new Date());    // true
 * is.object([]);            // false
 * is.object(null);          // false
 * ```
 */
export const isObject: Guard<object> = simple<object>(
  (value) => typeof value === "object" && value !== null && !Array.isArray(value),
  "object"
);

/**
 * Checks that a value exists (any value, including `null` and `undefined`).
 */
export const isAny: Guard<unknown> = simple<unknown>(() => true, "any value");

/**
 * Checks that a value is truthy (coerces with `Boolean`).
 *
 * @example
 * ```ts
 * is.truthy(1);   // true
 * is.truthy(0);   // false
 * is.truthy("");  // false
 * ```
 */
export const isTruthy: Guard<unknown> = simple<unknown>(
  (value) => Boolean(value),
  "truthy value"
);

/**
 * Checks that a value is falsy (coerces with `!value`).
 *
 * @example
 * ```ts
 * is.falsy(0);   // true
 * is.falsy("");  // true
 * is.falsy(1);   // false
 * ```
 */
export const isFalsy: Guard<unknown> = simple<unknown>((value) => !value, "falsy value");