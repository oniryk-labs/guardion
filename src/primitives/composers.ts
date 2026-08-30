import { described, guard, Guard, typeName } from "../guard";

/**
 * Checks that a value is one of the given literal values.
 *
 * Uses `Array.prototype.includes` semantics (strict equality).
 *
 * @typeParam T - the inferred union of literals
 * @param values - the allowed values
 *
 * @example
 * ```ts
 * const isColor = is.oneOf("red", "green", "blue");
 * isColor("red");    // true
 * isColor("yellow"); // false
 * ```
 */
export function isOneOf<const T>(...values: readonly T[]): Guard<T> {
  return described<T>(
    (value) => (values as readonly unknown[]).includes(value),
    (value, path) => {
      if ((values as readonly unknown[]).includes(value)) {
        return null;
      }

      return `${path}: expected one of [${values
        .map((v) => JSON.stringify(v))
        .join(", ")}], received ${typeName(value)}`;
    },
  );
}

/**
 * Checks that a value is exactly the given literal.
 *
 * Uses `Object.is` semantics: `NaN` matches `NaN`, and `0`/`-0` are distinct.
 *
 * @typeParam T - the literal type
 * @param value - the exact value to match
 *
 * @example
 * ```ts
 * is.literal("admin")("admin");  // true
 * is.literal("admin")("user");   // false
 * ```
 */
export function isLiteral<const T>(value: T): Guard<T> {
  return described<T>(
    (v) => Object.is(v, value),
    (v, path) => {
      if (Object.is(v, value)) {
        return null;
      }

      return `${path}: expected literal ${JSON.stringify(value)}, received ${typeName(v)}`;
    },
  );
}

/**
 * Checks that a value passes at least one of the given guards (logical OR).
 *
 * @typeParam T - a tuple of the guarded types
 * @param guards - the guards to try
 *
 * @example
 * ```ts
 * const isId = is.union(is.string, is.number);
 * isId("u1");  // true
 * isId(42);    // true
 * isId(true);  // false
 * ```
 */
export function isUnion<T extends readonly unknown[]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<T[number]> {
  const unionGuard = guard<T[number]>((value) => guards.some((g) => g(value)));
  unionGuard.describe = (value, path) => {
    if (guards.some((g) => g(value))) {
      return null;
    }

    return `${path}: value did not match any of ${guards.length} alternatives`;
  };
  return unionGuard;
}

/**
 * Checks that a value passes every one of the given guards (logical AND).
 *
 * @typeParam T - a tuple of the guarded types
 * @param guards - the guards that must all pass
 *
 * @example
 * ```ts
 * const isStrongPassword = is.all(is.string, is.string.min(8));
 * isStrongPassword("abcdefgh");  // true
 * isStrongPassword("abc");       // false
 * ```
 */
export function isAll<T extends readonly unknown[]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
): Guard<T[number]> {
  return guard<T[number]>((value) => guards.every((g) => g(value)));
}

/**
 * Checks that a value does NOT pass the given guard (logical negation).
 *
 * @typeParam T - the type rejected by the inner guard
 * @param itemGuard - the guard to negate
 *
 * @example
 * ```ts
 * const isDefined = is.not(is.null);
 * isDefined("x");  // true
 * isDefined(null); // false
 * ```
 */
export function isNot<T>(itemGuard: Guard<T>): Guard<unknown> {
  return guard<unknown>((value) => !itemGuard(value));
}

/**
 * Checks that a value is `undefined` or passes the given guard.
 *
 * @typeParam T - the guarded type
 * @param itemGuard - the guard applied to defined values
 *
 * @example
 * ```ts
 * const isOptionalString = is.optional(is.string);
 * isOptionalString("x");       // true
 * isOptionalString(undefined); // true
 * isOptionalString(null);      // false
 * ```
 */
export function isOptional<T>(itemGuard: Guard<T>): Guard<T | undefined> {
  const optionalGuard = guard<T | undefined>(
    (value) => value === undefined || itemGuard(value),
  );
  optionalGuard.describe = (value, path) => {
    if (value === undefined) {
      return null;
    }

    if (itemGuard(value)) {
      return null;
    }

    return itemGuard.describe?.(value, path) ?? `${path}: guard failed`;
  };
  return optionalGuard;
}

/**
 * Checks that a value is `null` or passes the given guard.
 *
 * @typeParam T - the guarded type
 * @param itemGuard - the guard applied to non-null values
 *
 * @example
 * ```ts
 * const isNullableString = is.nullable(is.string);
 * isNullableString("x");  // true
 * isNullableString(null); // true
 * isNullableString(undefined); // false
 * ```
 */
export function isNullable<T>(itemGuard: Guard<T>): Guard<T | null> {
  const nullableGuard = guard<T | null>(
    (value) => value === null || itemGuard(value),
  );

  nullableGuard.describe = (value, path) => {
    if (value === null) {
      return null;
    }

    if (itemGuard(value)) {
      return null;
    }

    return itemGuard.describe?.(value, path) ?? `${path}: guard failed`;
  };

  return nullableGuard;
}

/**
 * A schema mapping field names to their guards.
 */
export type Schema = Record<string, Guard<unknown>>;

/**
 * The object type inferred from a {@link Schema}.
 */
export type ShapeType<S extends Schema> = {
  [K in keyof S]: S[K] extends Guard<infer T> ? T : never;
};

/**
 * Checks that a value is an object whose fields satisfy the schema guards.
 *
 * - Every schema key must be present (unless its guard accepts `undefined`,
 *   e.g. `is.optional`).
 * - Extra keys on the object are ignored.
 * - Schemas nest freely.
 *
 * @typeParam S - the schema
 * @param schema - field guards keyed by field name
 *
 * @example
 * ```ts
 * const isUser = is.shape({
 *   id: is.string,
 *   name: is.string.notEmpty,
 *   age: is.int,
 *   email: is.optional(is.string),
 * });
 * isUser({ id: "1", name: "Bruno", age: 30 });  // true
 * isUser({ id: "1", name: "Bruno" });           // false (age missing)
 * ```
 */
export function isShape<S extends Schema>(schema: S): Guard<ShapeType<S>> {
  const shapeGuard = guard<ShapeType<S>>((value) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return false;
    }

    const record = value as Record<string, unknown>;

    return Object.entries(schema).every(([key, itemGuard]) =>
      itemGuard(record[key]),
    );
  });

  shapeGuard.describe = (value, path) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return `${path}: expected object, received ${typeName(value)}`;
    }

    const record = value as Record<string, unknown>;

    for (const [key, itemGuard] of Object.entries(schema)) {
      if (!itemGuard(record[key])) {
        const childPath = `${path}.${key}`;

        return (
          itemGuard.describe?.(record[key], childPath) ??
          `${childPath}: guard failed`
        );
      }
    }

    return null;
  };

  return shapeGuard;
}
