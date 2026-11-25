import { Guard, simple, typeName, TypePreservingGuard } from "../guard.js";

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
 * Checks that a value is not `null` or `undefined`, keeping the value's own
 * type instead of narrowing to a fixed one.
 *
 * @example
 * ```ts
 * is.defined(0);     // true
 * is.defined(null);  // false
 *
 * const maybeName: string | null = "Bruno";
 * if (is.defined(maybeName)) {
 *   maybeName.toUpperCase(); // string
 * }
 * ```
 */
export const isDefined: TypePreservingGuard = Object.assign(
  <T>(value: T): value is NonNullable<T> =>
    value !== null && value !== undefined,
  {
    preservesType: true as const,
    describe: (value: unknown, path: string) =>
      value === null || value === undefined
        ? `${path}: expected defined value, received ${typeName(value)}`
        : null,
  }
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