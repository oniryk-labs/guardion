import { describe, expect, expectTypeOf, it } from "vitest";
import { is } from "../src/registry";
import type { InferGuard } from "../src/guard";

describe("InferGuard", () => {
  it("extracts the type narrowed by a guard", () => {
    const isSummary = is.shape({
      total: is.int,
      done: is.int,
      skipped: is.int,
      none: is.int,
    });

    type Summary = InferGuard<typeof isSummary>;

    expect(
      isSummary({ total: 1, done: 1, skipped: 0, none: 0 }),
    ).toBe(true);
    expectTypeOf<Summary>().toEqualTypeOf<{
      total: number;
      done: number;
      skipped: number;
      none: number;
    }>();
  });

  it("extracts the type from a plain type predicate", () => {
    expectTypeOf<InferGuard<(value: unknown) => value is string>>().toEqualTypeOf<string>();
    expectTypeOf<
      InferGuard<(value: unknown) => value is { id: number }>
    >().toEqualTypeOf<{ id: number }>();
  });

  it("yields never for types that are not type predicates", () => {
    expectTypeOf<InferGuard<(value: unknown) => boolean>>().toEqualTypeOf<never>();
    expectTypeOf<InferGuard<string>>().toEqualTypeOf<never>();
    expectTypeOf<InferGuard<unknown>>().toEqualTypeOf<never>();
  });
});
