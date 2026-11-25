import { Guard } from "./guard.js";
import * as primitives from "./primitives/index.js";

/**
 * The `is` namespace: every built-in guard, plus {@link Is.register}.
 *
 * Extend it with custom guards via {@link Is.register}, or with
 * declaration merging for extra type safety:
 *
 * ```ts
 * declare module "@oniryk/guardion" {
 *   interface Is {
 *     email: Guard<string>;
 *   }
 * }
 * ```
 */
export interface Is {
  /** Guard for integers. */
  readonly int: typeof primitives.isInt;
  /** Guard for finite, non-integer numbers. */
  readonly float: typeof primitives.isFloat;
  /** Guard for finite numbers (with `.unsigned`, `.positive`, `.negative`, `.between`). */
  readonly number: typeof primitives.isNumber;
  /** Guard for `null`. */
  readonly null: typeof primitives.isNull;
  /** Guard for non-null, non-array objects. */
  readonly object: typeof primitives.isObject;
  /** Guard for arrays (with `.of`, `.notEmpty`, `.min`, `.max`). */
  readonly array: typeof primitives.isArray;
  /** Guard for values that are not `null` or `undefined`. */
  readonly defined: typeof primitives.isDefined;
  /** Guard for strings (with `.notEmpty`, `.min`, `.max`, `.matches`, `.numeric`). */
  readonly string: typeof primitives.isString;
  /** Guard for instances of a given constructor. */
  readonly instanceOf: typeof primitives.isInstanceOf;
  /** Guard for `Set` (with `.of`). */
  readonly set: typeof primitives.isSet;
  /** Guard for `Map`. */
  readonly map: typeof primitives.isMap;
  /** Guard for `Date`. */
  readonly date: typeof primitives.isDate;
  /** Guard for `RegExp`. */
  readonly regexp: typeof primitives.isRegExp;
  /** Guard for `Error` and subclasses. */
  readonly error: typeof primitives.isError;
  /** Guard for `symbol`. */
  readonly symbol: typeof primitives.isSymbol;
  /** Guard for `bigint`. */
  readonly bigint: typeof primitives.isBigInt;
  /** Alias for {@link Is.boolean}. */
  readonly bool: typeof primitives.isBool;
  /** Guard for `boolean`. */
  readonly boolean: typeof primitives.isBoolean;
  /** Guard for callable values (functions and classes). */
  readonly callable: typeof primitives.isCallable;
  /** Guard that accepts any value. */
  readonly any: typeof primitives.isAny;
  /** Guard for truthy values. */
  readonly truthy: typeof primitives.isTruthy;
  /** Guard for falsy values. */
  readonly falsy: typeof primitives.isFalsy;
  /** Guard for `Promise`. */
  readonly promise: typeof primitives.isPromise;
  /** Guard for one of the given literal values. */
  readonly oneOf: typeof primitives.isOneOf;
  /** Guard for an exact literal value. */
  readonly literal: typeof primitives.isLiteral;
  /** Guard that passes when any of the given guards passes. */
  readonly union: typeof primitives.isUnion;
  /** Guard that passes when all of the given guards pass. */
  readonly all: typeof primitives.isAll;
  /** Guard that passes when the given guard fails. */
  readonly not: typeof primitives.isNot;
  /** Guard for the inner type or `undefined`. */
  readonly optional: typeof primitives.isOptional;
  /** Guard for the inner type or `null`. */
  readonly nullable: typeof primitives.isNullable;
  /** Guard for objects with typed fields. */
  readonly shape: typeof primitives.isShape;
  /** Guard for `undefined`. */
  readonly undefined: typeof primitives.isUndefined;
  /** Guard for plain objects whose values pass a guard. */
  readonly record: typeof primitives.isRecord;

  /**
   * Registers a custom guard on this namespace.
   *
   * The guard is available at runtime as `is.<name>`. For the type to be
   * visible, augment the {@link Is} interface via declaration merging:
   *
   * ```ts
   * declare module "@oniryk/guardion" {
   *   interface Is {
   *     email: Guard<string>;
   *   }
   * }
   * is.register("email", is.string.matches(/^[^@\s]+@/));
   * ```
   *
   * @typeParam T - the type the guard narrows to
   * @param name - the property name under which the guard is registered
   * @param guard - the guard to register
   */
  register<T>(name: string, guard: Guard<T>): void;
}

/**
 * Creates an independent `is` namespace instance.
 *
 * Guards registered on the returned instance do not affect the default
 * singleton `is` (and vice versa). All instances share the built-in guards.
 *
 * @returns a new namespace instance
 *
 * @example
 * ```ts
 * const customIs = createIs();
 * customIs.register("even", guard((v) => typeof v === "number" && v % 2 === 0));
 * ```
 */
export function createIs(): Is {
  const is = {
    int: primitives.isInt,
    float: primitives.isFloat,
    number: primitives.isNumber,
    null: primitives.isNull,
    object: primitives.isObject,
    array: primitives.isArray,
    defined: primitives.isDefined,
    string: primitives.isString,
    instanceOf: primitives.isInstanceOf,
    set: primitives.isSet,
    map: primitives.isMap,
    date: primitives.isDate,
    regexp: primitives.isRegExp,
    error: primitives.isError,
    symbol: primitives.isSymbol,
    bigint: primitives.isBigInt,
    bool: primitives.isBool,
    boolean: primitives.isBoolean,
    callable: primitives.isCallable,
    any: primitives.isAny,
    truthy: primitives.isTruthy,
    falsy: primitives.isFalsy,
    promise: primitives.isPromise,
    oneOf: primitives.isOneOf,
    literal: primitives.isLiteral,
    union: primitives.isUnion,
    all: primitives.isAll,
    not: primitives.isNot,
    optional: primitives.isOptional,
    nullable: primitives.isNullable,
    shape: primitives.isShape,
    undefined: primitives.isUndefined,
    record: primitives.isRecord,
  } as Is;

  is.register = function register<T>(name: string, guard: Guard<T>): void {
    (is as unknown as Record<string, unknown>)[name] = guard;
  };

  return is;
}

/**
 * The default `is` namespace singleton.
 *
 * Register custom guards on it with `is.register(...)` or create an isolated
 * instance with {@link createIs}.
 */
export const is = createIs();