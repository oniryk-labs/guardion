/**
 * Describes why a value failed a guard.
 *
 * Returns a human-readable failure message, or `null` when the value is valid.
 * Composable guards use it to report the exact path of the failing field.
 *
 * @param value - the value being validated
 * @param path - the path of `value` (e.g. `value.user.name` or `value.tags[1]`)
 * @returns a failure message, or `null` when the guard passes
 */
export type Describe = (value: unknown, path: string) => string | null;

/**
 * A runtime type guard: a function that narrows an unknown value to type `T`.
 *
 * A `Guard<T>` is also a TypeScript type predicate, so using it inside an
 * `if` (or `enforce`) narrows the type automatically.
 *
 * @example
 * ```ts
 * const isName: Guard<string> = is.shape({ name: is.string });
 * if (isName(value)) {
 *   value.name; // string
 * }
 * ```
 */
export interface Guard<T> {
  (value: unknown): value is T;
  /**
   * Optional explainer used by `enforce` to build detailed error messages.
   */
  describe?: Describe;
}

/**
 * Extracts the narrowed type from a guard (or any type predicate).
 *
 * Handy when the guard is a value and you need its type: define the guard
 * once, then recover the type with `typeof`.
 *
 * @typeParam T - a guard (or any type predicate)
 *
 * @example
 * ```ts
 * const isOrder = is.shape({
 *   id: is.string.notEmpty,
 *   quantity: is.int,
 *   price: is.number.positive,
 * });
 *
 * type Order = InferGuard<typeof isOrder>;
 * // { id: string; quantity: number; price: number }
 * ```
 */
export type InferGuard<T> = T extends (value: unknown) => value is infer U
  ? U
  : never;

/**
 * Builds a `Guard<T>` from a boolean predicate.
 *
 * @typeParam T - the type the guard narrows to
 * @param predicate - function that returns `true` when the value is valid
 * @returns a runtime type guard
 *
 * @example
 * ```ts
 * const isPositive = guard<number>((value) => typeof value === "number" && value > 0);
 * ```
 */
export function guard<T>(predicate: (value: unknown) => boolean): Guard<T> {
  return predicate as Guard<T>;
}

/**
 * Builds a `Guard<T>` and attaches a `describe` function for error messages.
 *
 * @typeParam T - the type the guard narrows to
 * @param predicate - function that returns `true` when the value is valid
 * @param describe - explainer used by `enforce` to report failures
 * @returns a runtime type guard with error reporting
 */
export function described<T>(
  predicate: (value: unknown) => boolean,
  describe: Describe,
): Guard<T> {
  const g = guard<T>(predicate);
  g.describe = describe;

  return g;
}

/**
 * Builds a `Guard<T>` with a standard `describe` message:
 * `${path}: expected ${expected}, received ${typeName(value)}`.
 *
 * @typeParam T - the type the guard narrows to
 * @param predicate - function that returns `true` when the value is valid
 * @param expected - human-readable description of the expected type
 * @returns a runtime type guard with error reporting
 */
export function simple<T>(
  predicate: (value: unknown) => boolean,
  expected: string,
): Guard<T> {
  return described<T>(predicate, (value, path) => {
    if (predicate(value)) {
      return null;
    }

    return `${path}: expected ${expected}, received ${typeName(value)}`;
  });
}

/**
 * Returns a short, human-readable name for a value's runtime type.
 *
 * `null` and arrays are reported specially; everything else uses `typeof`.
 *
 * @param value - the value to classify
 * @returns the type name (e.g. `"string"`, `"number"`, `"null"`, `"array"`)
 *
 * @example
 * ```ts
 * typeName(null); // "null"
 * typeName([]);   // "array"
 * typeName("x");  // "string"
 * ```
 */
export function typeName(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
}
