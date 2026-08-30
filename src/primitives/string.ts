import { Guard, simple } from "../guard";

/**
 * A `Guard<string>` with string-specific variations.
 */
export interface StringGuard extends Guard<string> {
  /** Non-empty string. */
  notEmpty: Guard<string>;
  /**
   * String with at least the given length.
   *
   * @param length - minimum length (inclusive)
   */
  min: (length: number) => Guard<string>;
  /**
   * String with at most the given length.
   *
   * @param length - maximum length (inclusive)
   */
  max: (length: number) => Guard<string>;
  /**
   * String matching a regular expression.
   *
   * @param regex - the pattern to match
   */
  matches: (regex: RegExp) => Guard<string>;
  /** String that parses to a finite number (e.g. `"42"`, `"-4.2"`). */
  numeric: Guard<string>;
}

/**
 * Checks that a value is a string.
 *
 * Boxed strings (`new String("x")`) are rejected.
 *
 * @example
 * ```ts
 * is.string("hello");  // true
 * is.string(42);       // false
 * ```
 */
export const isString: StringGuard = Object.assign(
  simple<string>((value) => typeof value === "string", "string"),
  {
    notEmpty: simple<string>(
      (value) => typeof value === "string" && value.length > 0,
      "non-empty string"
    ),
    min: (length: number): Guard<string> =>
      simple<string>(
        (value) => typeof value === "string" && value.length >= length,
        `string with length >= ${length}`
      ),
    max: (length: number): Guard<string> =>
      simple<string>(
        (value) => typeof value === "string" && value.length <= length,
        `string with length <= ${length}`
      ),
    matches: (regex: RegExp): Guard<string> =>
      simple<string>(
        (value) => typeof value === "string" && regex.test(value),
        `string matching ${regex}`
      ),
    numeric: simple<string>(
      (value) =>
        typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value)),
      "numeric string"
    ),
  }
);