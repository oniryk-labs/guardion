import { Guard } from "./guard.js";

/**
 * Error thrown by {@link enforce} when a value fails its guard.
 *
 * The message includes the failing path and the expected/received types when
 * the guard provides them.
 */
export class GuardianError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuardianError";
  }
}

/**
 * Validates a value against a guard and returns it with the narrowed type.
 *
 * Throws a {@link GuardianError} when the value does not satisfy the guard.
 *
 * @typeParam T - the type the guard narrows to
 * @param value - the value to validate
 * @param guard - the guard to satisfy
 * @param message - optional custom error message (takes precedence over the guard's)
 * @returns the value, narrowed to `T`
 * @throws {@link GuardianError} when the guard fails
 *
 * @example
 * ```ts
 * const user = enforce(data, isUser);
 * // user: { id: string; name: string; ... } — throws if invalid
 *
 * // error message: "value.age: expected integer, received string"
 * ```
 */
export function enforce<T>(value: unknown, guard: Guard<T>, message?: string): T {
  if (guard(value)) {
    return value;
  }

  const reason = guard.describe?.(value, "value");

  throw new GuardianError(
    message ?? reason ?? `Guard failed for value of type "${typeof value}"`
  );
}