import { Guard, simple } from "../guard.js";

/**
 * Checks that a value is an integer.
 *
 * `NaN` and `Infinity` are never valid numbers.
 *
 * @example
 * ```ts
 * is.int(42);      // true
 * is.int(4.2);     // false
 * is.int("42");    // false
 * ```
 */
export const isInt: Guard<number> = simple(
  (value) => typeof value === "number" && Number.isInteger(value),
  "integer"
);

/**
 * Checks that a value is a finite, non-integer number.
 *
 * @example
 * ```ts
 * is.float(4.2);   // true
 * is.float(42);    // false
 * ```
 */
export const isFloat: Guard<number> = simple(
  (value) => typeof value === "number" && Number.isFinite(value) && !Number.isInteger(value),
  "float"
);

/**
 * A `Guard<number>` with number-specific variations.
 */
export interface NumberGuard extends Guard<number> {
  /** Non-negative finite number (`>= 0`). */
  unsigned: Guard<number>;
  /** Finite number greater than zero (`> 0`). */
  positive: Guard<number>;
  /** Finite number less than zero (`< 0`). */
  negative: Guard<number>;
  /**
   * Finite number within a closed interval.
   *
   * @param min - inclusive lower bound
   * @param max - inclusive upper bound
   */
  between: (min: number, max: number) => Guard<number>;
}

/**
 * Checks that a value is a finite number.
 *
 * `NaN` and `Infinity` are rejected.
 *
 * @example
 * ```ts
 * is.number(42);    // true
 * is.number(NaN);   // false
 * is.number("42");  // false
 * ```
 */
export const isNumber: NumberGuard = Object.assign(
  simple<number>(
    (value) => typeof value === "number" && Number.isFinite(value),
    "finite number"
  ),
  {
    unsigned: simple<number>(
      (value) => typeof value === "number" && Number.isFinite(value) && value >= 0,
      "unsigned number"
    ),
    positive: simple<number>(
      (value) => typeof value === "number" && Number.isFinite(value) && value > 0,
      "positive number"
    ),
    negative: simple<number>(
      (value) => typeof value === "number" && Number.isFinite(value) && value < 0,
      "negative number"
    ),
    between: (min: number, max: number): Guard<number> =>
      simple<number>(
        (value) =>
          typeof value === "number" &&
          Number.isFinite(value) &&
          value >= min &&
          value <= max,
        `number between ${min} and ${max}`
      ),
  }
);