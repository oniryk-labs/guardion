import { describe, expect, it } from "vitest";
import { is } from "../src/index";

describe("is.oneOf", () => {
  const isColor = is.oneOf("red", "green", "blue");

  it("accepts listed values", () => {
    expect(isColor("red")).toBe(true);
    expect(isColor("green")).toBe(true);
    expect(isColor("blue")).toBe(true);
  });

  it("rejects non-listed values", () => {
    expect(isColor("yellow")).toBe(false);
    expect(isColor("red ")).toBe(false);
    expect(isColor("RED")).toBe(false);
    expect(isColor("")).toBe(false);
    expect(isColor(42)).toBe(false);
    expect(isColor(null)).toBe(false);
    expect(isColor(undefined)).toBe(false);
    expect(isColor({})).toBe(false);
  });

  it("supports mixed types", () => {
    const isMixed = is.oneOf<1 | "1" | null>(1, "1", null);
    expect(isMixed(1)).toBe(true);
    expect(isMixed("1")).toBe(true);
    expect(isMixed(null)).toBe(true);
    expect(isMixed(2)).toBe(false);
    expect(isMixed("2")).toBe(false);
  });

  it("compares references for objects", () => {
    const a = { id: 1 };
    const isA = is.oneOf(a);
    expect(isA(a)).toBe(true);
    expect(isA({ id: 1 })).toBe(false);
  });

  it("rejects everything when empty", () => {
    const isNothing = is.oneOf();
    expect(isNothing(1)).toBe(false);
    expect(isNothing("x")).toBe(false);
    expect(isNothing(null)).toBe(false);
    expect(isNothing(undefined)).toBe(false);
  });
});

describe("is.literal", () => {
  it("accepts the exact literal", () => {
    expect(is.literal("admin")("admin")).toBe(true);
    expect(is.literal(42)(42)).toBe(true);
    expect(is.literal(null)(null)).toBe(true);
  });

  it("rejects different values", () => {
    expect(is.literal("admin")("user")).toBe(false);
    expect(is.literal("admin")("ADMIN")).toBe(false);
    expect(is.literal(42)(43)).toBe(false);
    expect(is.literal(42)("42")).toBe(false);
    expect(is.literal("admin")(null)).toBe(false);
    expect(is.literal(null)(undefined)).toBe(false);
  });

  it("uses Object.is semantics for NaN and signed zero", () => {
    expect(is.literal(NaN)(NaN)).toBe(true);
    expect(is.literal(0)(0)).toBe(true);
    expect(is.literal(0)(-0)).toBe(false);
    expect(is.literal(-0)(0)).toBe(false);
  });
});

describe("is.union", () => {
  const isStringOrNumber = is.union(is.string, is.number);

  it("accepts values matching any guard", () => {
    expect(isStringOrNumber("x")).toBe(true);
    expect(isStringOrNumber(42)).toBe(true);
    expect(isStringOrNumber(4.5)).toBe(true);
    expect(isStringOrNumber("")).toBe(true);
  });

  it("rejects values matching no guard", () => {
    expect(isStringOrNumber(true)).toBe(false);
    expect(isStringOrNumber(null)).toBe(false);
    expect(isStringOrNumber(undefined)).toBe(false);
    expect(isStringOrNumber([])).toBe(false);
    expect(isStringOrNumber({})).toBe(false);
  });

  it("rejects everything when empty", () => {
    const isNothing = is.union();
    expect(isNothing(1)).toBe(false);
    expect(isNothing("x")).toBe(false);
    expect(isNothing(null)).toBe(false);
  });

  it("works with nullable compositions", () => {
    const isNullableString = is.union(is.string, is.null);
    expect(isNullableString("x")).toBe(true);
    expect(isNullableString(null)).toBe(true);
    expect(isNullableString(undefined)).toBe(false);
    expect(isNullableString(42)).toBe(false);
  });
});

describe("is.all", () => {
  const isStrongPassword = is.all(is.string, is.string.notEmpty, is.string.min(8));

  it("accepts values matching every guard", () => {
    expect(isStrongPassword("abcdefgh")).toBe(true);
    expect(isStrongPassword("a".repeat(20))).toBe(true);
  });

  it("rejects values failing any guard", () => {
    expect(isStrongPassword("abc")).toBe(false);
    expect(isStrongPassword("")).toBe(false);
    expect(isStrongPassword(12345678)).toBe(false);
    expect(isStrongPassword(null)).toBe(false);
    expect(isStrongPassword(undefined)).toBe(false);
    expect(isStrongPassword(["abcdefgh"])).toBe(false);
  });

  it("accepts everything when empty (vacuous truth)", () => {
    const isAnything = is.all();
    expect(isAnything(1)).toBe(true);
    expect(isAnything("x")).toBe(true);
    expect(isAnything(null)).toBe(true);
  });
});

describe("is.not", () => {
  it("rejects values matching the inner guard", () => {
    expect(is.not(is.null)(null)).toBe(false);
    expect(is.not(is.string)("x")).toBe(false);
    expect(is.not(is.number)(42)).toBe(false);
  });

  it("accepts values not matching the inner guard", () => {
    expect(is.not(is.null)("x")).toBe(true);
    expect(is.not(is.null)(undefined)).toBe(true);
    expect(is.not(is.null)(0)).toBe(true);
    expect(is.not(is.string)(42)).toBe(true);
    expect(is.not(is.number)("42")).toBe(true);
  });
});

describe("is.optional", () => {
  const isOptionalString = is.optional(is.string);

  it("accepts the inner type or undefined", () => {
    expect(isOptionalString("x")).toBe(true);
    expect(isOptionalString("")).toBe(true);
    expect(isOptionalString(undefined)).toBe(true);
  });

  it("rejects other values", () => {
    expect(isOptionalString(null)).toBe(false);
    expect(isOptionalString(42)).toBe(false);
    expect(isOptionalString({})).toBe(false);
    expect(isOptionalString([])).toBe(false);
    expect(isOptionalString(false)).toBe(false);
  });
});

describe("is.nullable", () => {
  const isNullableString = is.nullable(is.string);

  it("accepts the inner type or null", () => {
    expect(isNullableString("x")).toBe(true);
    expect(isNullableString("")).toBe(true);
    expect(isNullableString(null)).toBe(true);
  });

  it("rejects other values", () => {
    expect(isNullableString(undefined)).toBe(false);
    expect(isNullableString(42)).toBe(false);
    expect(isNullableString({})).toBe(false);
    expect(isNullableString([])).toBe(false);
    expect(isNullableString(false)).toBe(false);
  });
});