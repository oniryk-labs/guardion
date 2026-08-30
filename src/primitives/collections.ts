import { guard, Guard, simple, typeName } from "../guard";

/**
 * A `Guard<unknown[]>` with array-specific variations.
 */
export interface ArrayGuard extends Guard<unknown[]> {
  /**
   * Array whose elements all pass the given guard.
   *
   * @typeParam T - the element type
   * @param itemGuard - guard applied to every element
   */
  of: <T>(itemGuard: Guard<T>) => Guard<T[]>;
  /** Non-empty array. */
  notEmpty: Guard<[unknown, ...unknown[]]>;
  /**
   * Array with at least the given length.
   *
   * @param length - minimum length (inclusive)
   */
  min: (length: number) => Guard<unknown[]>;
  /**
   * Array with at most the given length.
   *
   * @param length - maximum length (inclusive)
   */
  max: (length: number) => Guard<unknown[]>;
}

/**
 * Checks that a value is an array.
 *
 * Typed arrays (e.g. `Uint8Array`) are not arrays.
 *
 * @example
 * ```ts
 * is.array([1, 2]);  // true
 * is.array("x");     // false
 * ```
 */
export const isArray: ArrayGuard = Object.assign(
  simple<unknown[]>((value) => Array.isArray(value), "array"),
  {
    of: <T>(itemGuard: Guard<T>): Guard<T[]> => {
      const arrayOfGuard = guard<T[]>(
        (value) => Array.isArray(value) && value.every(itemGuard),
      );
      arrayOfGuard.describe = (value, path) => {
        if (!Array.isArray(value)) {
          return `${path}: expected array, received ${typeName(value)}`;
        }

        for (let i = 0; i < value.length; i++) {
          if (!itemGuard(value[i])) {
            const childPath = `${path}[${i}]`;
            return (
              itemGuard.describe?.(value[i], childPath) ??
              `${childPath}: guard failed`
            );
          }
        }

        return null;
      };
      return arrayOfGuard;
    },
    notEmpty: simple<[unknown, ...unknown[]]>(
      (value) => Array.isArray(value) && value.length > 0,
      "non-empty array",
    ),
    min: (length: number): Guard<unknown[]> =>
      simple<unknown[]>(
        (value) => Array.isArray(value) && value.length >= length,
        `array with length >= ${length}`,
      ),
    max: (length: number): Guard<unknown[]> =>
      simple<unknown[]>(
        (value) => Array.isArray(value) && value.length <= length,
        `array with length <= ${length}`,
      ),
  },
);

/**
 * A `Guard<Set<unknown>>` with Set-specific variations.
 */
export interface SetGuard extends Guard<Set<unknown>> {
  /**
   * Set whose elements all pass the given guard.
   *
   * @typeParam T - the element type
   * @param itemGuard - guard applied to every element
   */
  of: <T>(itemGuard: Guard<T>) => Guard<Set<T>>;
}

/**
 * Checks that a value is a `Set`.
 *
 * @example
 * ```ts
 * is.set(new Set([1, 2]));  // true
 * is.set([]);               // false
 * ```
 */
export const isSet: SetGuard = Object.assign(
  simple<Set<unknown>>((value) => value instanceof Set, "Set"),
  {
    of: <T>(itemGuard: Guard<T>): Guard<Set<T>> => {
      const setOfGuard = guard<Set<T>>(
        (value) => value instanceof Set && [...value].every(itemGuard),
      );
      setOfGuard.describe = (value, path) => {
        if (!(value instanceof Set)) {
          return `${path}: expected Set, received ${typeName(value)}`;
        }

        let index = 0;

        for (const item of value) {
          if (!itemGuard(item)) {
            const childPath = `${path}[${index}]`;
            return (
              itemGuard.describe?.(item, childPath) ??
              `${childPath}: guard failed`
            );
          }

          index++;
        }

        return null;
      };
      return setOfGuard;
    },
  },
);

/**
 * Checks that a value is a `Map`.
 */
export const isMap: Guard<Map<unknown, unknown>> = simple<
  Map<unknown, unknown>
>((value) => value instanceof Map, "Map");

/**
 * Checks that a value is a plain object.
 *
 * A plain object has `Object.prototype` (or `null`) as its prototype — class
 * instances and collections (`Map`, `Set`, `Date`, ...) are excluded.
 *
 * @param value - the value to check
 * @returns `true` when the value is a plain object
 */
export function isPlainObject(value: unknown): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Checks that a value is a plain object whose values all pass the given guard.
 *
 * Unlike {@link isObject}, collections and class instances are rejected.
 *
 * @typeParam T - the value type of the record
 * @param valueGuard - guard applied to every value
 *
 * @example
 * ```ts
 * is.record(is.number)({ a: 1, b: 2 });  // true
 * is.record(is.number)(new Map());       // false
 * ```
 */
export function isRecord<T = unknown>(
  valueGuard: Guard<T>,
): Guard<Record<string, T>> {
  const recordGuard = guard<Record<string, T>>(
    (value: unknown) =>
      isPlainObject(value) &&
      Object.values(value as Record<string, unknown>).every(valueGuard),
  );

  recordGuard.describe = (value, path) => {
    if (!isPlainObject(value)) {
      return `${path}: expected record, received ${typeName(value)}`;
    }

    const record = value as Record<string, unknown>;

    for (const [key, childValue] of Object.entries(record)) {
      if (!valueGuard(childValue)) {
        const childPath = `${path}["${key}"]`;
        return (
          valueGuard.describe?.(childValue, childPath) ??
          `${childPath}: guard failed`
        );
      }
    }

    return null;
  };

  return recordGuard;
}
