import { describe, expect, it } from "vitest";
import { is } from "../src/index";

describe("is.boolean", () => {
  it("accepts booleans", () => {
    expect(is.boolean(true)).toBe(true);
    expect(is.boolean(false)).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.boolean(1)).toBe(false);
    expect(is.boolean(0)).toBe(false);
    expect(is.boolean("true")).toBe(false);
    expect(is.boolean("false")).toBe(false);
    expect(is.boolean("")).toBe(false);
    expect(is.boolean(null)).toBe(false);
    expect(is.boolean(undefined)).toBe(false);
    expect(is.boolean([])).toBe(false);
    expect(is.boolean({})).toBe(false);
    expect(is.boolean(new Boolean(true))).toBe(false);
    expect(is.boolean(NaN)).toBe(false);
  });
});

describe("is.bool", () => {
  it("is an alias of is.boolean", () => {
    expect(is.bool(true)).toBe(true);
    expect(is.bool(false)).toBe(true);
    expect(is.bool(1)).toBe(false);
    expect(is.bool(0)).toBe(false);
  });
});

describe("is.null", () => {
  it("accepts only null", () => {
    expect(is.null(null)).toBe(true);
    expect(is.null(undefined)).toBe(false);
    expect(is.null(0)).toBe(false);
    expect(is.null(false)).toBe(false);
    expect(is.null("")).toBe(false);
    expect(is.null(NaN)).toBe(false);
    expect(is.null({})).toBe(false);
    expect(is.null([])).toBe(false);
  });
});

describe("is.undefined", () => {
  it("accepts only undefined", () => {
    expect(is.undefined(undefined)).toBe(true);
    expect(is.undefined(null)).toBe(false);
    expect(is.undefined(0)).toBe(false);
    expect(is.undefined(false)).toBe(false);
    expect(is.undefined("")).toBe(false);
    expect(is.undefined({})).toBe(false);
  });
});

describe("is.defined", () => {
  it("accepts any non-nullish value", () => {
    expect(is.defined(0)).toBe(true);
    expect(is.defined("")).toBe(true);
    expect(is.defined(false)).toBe(true);
    expect(is.defined(NaN)).toBe(true);
    expect(is.defined({})).toBe(true);
    expect(is.defined([])).toBe(true);
    expect(is.defined(() => {})).toBe(true);
    expect(is.defined(Symbol("x"))).toBe(true);
    expect(is.defined(10n)).toBe(true);
  });

  it("rejects null and undefined", () => {
    expect(is.defined(null)).toBe(false);
    expect(is.defined(undefined)).toBe(false);
  });
});

describe("is.any", () => {
  it("accepts every value", () => {
    expect(is.any(null)).toBe(true);
    expect(is.any(undefined)).toBe(true);
    expect(is.any(0)).toBe(true);
    expect(is.any("")).toBe(true);
    expect(is.any(false)).toBe(true);
    expect(is.any({})).toBe(true);
    expect(is.any([])).toBe(true);
    expect(is.any(Symbol("x"))).toBe(true);
    expect(is.any(10n)).toBe(true);
    expect(is.any(() => {})).toBe(true);
  });
});

describe("is.truthy", () => {
  it("accepts truthy values", () => {
    expect(is.truthy(1)).toBe(true);
    expect(is.truthy(-1)).toBe(true);
    expect(is.truthy("x")).toBe(true);
    expect(is.truthy("0")).toBe(true);
    expect(is.truthy(true)).toBe(true);
    expect(is.truthy({})).toBe(true);
    expect(is.truthy([])).toBe(true);
    expect(is.truthy(Infinity)).toBe(true);
  });

  it("rejects falsy values", () => {
    expect(is.truthy(0)).toBe(false);
    expect(is.truthy(-0)).toBe(false);
    expect(is.truthy("")).toBe(false);
    expect(is.truthy(false)).toBe(false);
    expect(is.truthy(null)).toBe(false);
    expect(is.truthy(undefined)).toBe(false);
    expect(is.truthy(NaN)).toBe(false);
  });
});

describe("is.falsy", () => {
  it("accepts falsy values", () => {
    expect(is.falsy(0)).toBe(true);
    expect(is.falsy(-0)).toBe(true);
    expect(is.falsy("")).toBe(true);
    expect(is.falsy(false)).toBe(true);
    expect(is.falsy(null)).toBe(true);
    expect(is.falsy(undefined)).toBe(true);
    expect(is.falsy(NaN)).toBe(true);
  });

  it("rejects truthy values", () => {
    expect(is.falsy(1)).toBe(false);
    expect(is.falsy("x")).toBe(false);
    expect(is.falsy(true)).toBe(false);
    expect(is.falsy({})).toBe(false);
    expect(is.falsy([])).toBe(false);
  });
});