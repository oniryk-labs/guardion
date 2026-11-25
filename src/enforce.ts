import { Guard, TypePreservingGuard, typeName } from "./guard.js";

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
 * When the value does not satisfy the guard, throws the given `Error` (useful
 * for domain exceptions) or a {@link GuardianError} otherwise.
 *
 * @typeParam T - the type the guard narrows to
 * @param value - the value to validate
 * @param guard - the guard to satisfy
 * @param failure - optional custom error message, or the error instance to throw
 * @returns the value, narrowed to `T`
 * @throws the given error, or {@link GuardianError} when the guard fails
 *
 * @example
 * ```ts
 * const user = enforce(data, isUser);
 * // user: { id: string; name: string; ... } — throws if invalid
 *
 * // error message: "value.age: expected integer, received string"
 *
 * const found = enforce(maybeUser, is.defined);
 * // found: User — is.defined keeps the value's own type
 *
 * enforce(maybeUser, is.referable(User), new ResourceNotFoundException(User));
 * // throws the given domain exception instead of GuardianError
 * ```
 */
export function enforce<T>(
  value: T,
  guard: TypePreservingGuard,
  failure?: string | Error
): NonNullable<T>;
export function enforce<T>(
  value: unknown,
  guard: Guard<T>,
  failure?: string | Error
): T;
export function enforce(
  value: unknown,
  guard: Guard<unknown>,
  failure?: string | Error
): unknown {
  if (guard(value)) {
    return value;
  }

  if (failure instanceof Error) {
    throw failure;
  }

  const reason = guard.describe?.(value, "value");

  throw new GuardianError(
    failure ?? reason ?? `Guard failed for value of type "${typeName(value)}"`
  );
}
