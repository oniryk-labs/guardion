import { describe, expect, it } from "vitest";
import { createIs, guard, is, enforce } from "../src/index";
import type { Guard } from "../src/index";

describe("is namespace", () => {
  it("is a singleton with every helper", () => {
    expect(is.string("x")).toBe(true);
    expect(is.number(1)).toBe(true);
    expect(is.shape({ a: is.string })({ a: "x" })).toBe(true);
  });
});

describe("register", () => {
  it("registers a guard accessible on the same instance", () => {
    is.register("positive", guard((v: unknown) => typeof v === "number" && (v as number) > 0));

    const isPositive = (is as unknown as Record<string, Guard<unknown>>).positive!;
    expect(isPositive(5)).toBe(true);
    expect(isPositive(-1)).toBe(false);
    expect(isPositive("5")).toBe(false);
    expect(enforce(5, isPositive)).toBe(5);
    expect(() => enforce(-1, isPositive)).toThrow();
  });
});

describe("createIs", () => {
  it("creates independent instances", () => {
    const customIs = createIs();

    customIs.register("even", guard((v: unknown) => typeof v === "number" && (v as number) % 2 === 0));

    const registered = (customIs as unknown as Record<string, Guard<unknown>>).even!;
    expect(registered(4)).toBe(true);
    expect(registered(3)).toBe(false);

    // the default singleton must NOT be affected
    expect((is as unknown as Record<string, unknown>).even).toBeUndefined();
  });

  it("shares the primitive guards but not registrations", () => {
    const customIs = createIs();
    expect(customIs.string("x")).toBe(true);
    expect(customIs.number(1)).toBe(true);
    expect(customIs).not.toBe(is);
  });
});