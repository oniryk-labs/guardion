import { describe, expect, it } from "vitest";
import { described, guard, simple, typeName } from "../src/guard";

describe("guard", () => {
  it("creates a type guard from a predicate", () => {
    const isPositive = guard<number>((value) => typeof value === "number" && value > 0);
    expect(isPositive(1)).toBe(true);
    expect(isPositive(-1)).toBe(false);
    expect(isPositive("1")).toBe(false);
  });
});

describe("described", () => {
  it("attaches a describe function", () => {
    const g = described<number>(
      (value) => typeof value === "number",
      (value, path) => {
        if (typeof value === "number") {
          return null;
        }

        return `${path}: not a number`;
      }
    );
    expect(g(1)).toBe(true);
    expect(g.describe!(1, "value")).toBeNull();
    expect(g.describe!("x", "value")).toBe("value: not a number");
  });
});

describe("simple", () => {
  it("builds describe messages with expected and received type", () => {
    const g = simple<number>((value) => typeof value === "number", "number");
    expect(g.describe!("x", "value")).toBe("value: expected number, received string");
    expect(g.describe!(null, "value")).toBe("value: expected number, received null");
    expect(g.describe!([], "value")).toBe("value: expected number, received array");
    expect(g.describe!(1, "value")).toBeNull();
  });
});

describe("typeName", () => {
  it("classifies primitives and special values", () => {
    expect(typeName(null)).toBe("null");
    expect(typeName([])).toBe("array");
    expect(typeName("x")).toBe("string");
    expect(typeName(1)).toBe("number");
    expect(typeName(1n)).toBe("bigint");
    expect(typeName(true)).toBe("boolean");
    expect(typeName(Symbol("x"))).toBe("symbol");
    expect(typeName({})).toBe("object");
    expect(typeName(undefined)).toBe("undefined");
    expect(typeName(() => {})).toBe("function");
  });
});