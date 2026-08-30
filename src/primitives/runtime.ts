import { described, simple, typeName, Guard } from "../guard";

/**
 * Checks that a value is a `Date` instance.
 *
 * A timestamp number (`Date.now()`) is not a Date.
 */
export const isDate: Guard<Date> = simple<Date>((value) => value instanceof Date, "Date");

/**
 * Checks that a value is a `RegExp` instance.
 */
export const isRegExp: Guard<RegExp> = simple<RegExp>(
  (value) => value instanceof RegExp,
  "RegExp"
);

/**
 * Checks that a value is an `Error` (including subclasses).
 *
 * Plain objects with a `message` field are rejected.
 */
export const isError: Guard<Error> = simple<Error>(
  (value) => value instanceof Error,
  "Error"
);

/**
 * Checks that a value is a `symbol`.
 */
export const isSymbol: Guard<symbol> = simple<symbol>(
  (value) => typeof value === "symbol",
  "symbol"
);

/**
 * Checks that a value is a `bigint`.
 */
export const isBigInt: Guard<bigint> = simple<bigint>(
  (value) => typeof value === "bigint",
  "bigint"
);

/**
 * Checks that a value is a `Promise` instance.
 *
 * Thenables (`{ then() {} }`) and async functions are rejected.
 */
export const isPromise: Guard<Promise<unknown>> = simple<Promise<unknown>>(
  (value) => value instanceof Promise,
  "Promise"
);

/**
 * Checks that a value is callable (a function, including classes).
 *
 * @example
 * ```ts
 * is.callable(() => {});  // true
 * is.callable(42);        // false
 * ```
 */
export const isCallable: Guard<(...args: any[]) => unknown> = simple<
  (...args: any[]) => unknown
>((value) => typeof value === "function", "function");

/**
 * Checks that a value is an instance of the given constructor.
 *
 * Subclass instances are also accepted (inheritance).
 *
 * @typeParam T - the instance type produced by the constructor
 * @param ctor - the constructor to test against
 *
 * @example
 * ```ts
 * class User {}
 * const isUser = is.instanceOf(User);
 * isUser(new User());  // true
 * isUser({});          // false
 * ```
 */
export function isInstanceOf<T>(ctor: new (...args: any[]) => T): Guard<T> {
  return described<T>(
    (value) => value instanceof ctor,
    (value, path) => {
      if (value instanceof ctor) {
        return null;
      }

      return `${path}: expected instance of ${ctor.name}, received ${typeName(value)}`;
    }
  );
}