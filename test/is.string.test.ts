import { describe, expect, it } from "vitest";
import { is } from "../src/index";

describe("is.string", () => {
  it("accepts strings", () => {
    expect(is.string("hello")).toBe(true);
    expect(is.string("")).toBe(true);
    expect(is.string(" ")).toBe(true);
    expect(is.string("0")).toBe(true);
    expect(is.string("42")).toBe(true);
    expect(is.string("héllo")).toBe(true);
    expect(is.string("🚀")).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.string(42)).toBe(false);
    expect(is.string(0)).toBe(false);
    expect(is.string(true)).toBe(false);
    expect(is.string(false)).toBe(false);
    expect(is.string(null)).toBe(false);
    expect(is.string(undefined)).toBe(false);
    expect(is.string([])).toBe(false);
    expect(is.string({})).toBe(false);
    expect(is.string(new String("x"))).toBe(false);
    expect(is.string(Symbol("x"))).toBe(false);
    expect(is.string(42n)).toBe(false);
    expect(is.string(/x/)).toBe(false);
    expect(is.string(() => {})).toBe(false);
    expect(is.string(NaN)).toBe(false);
  });
});

describe("is.string.notEmpty", () => {
  it("accepts non-empty strings", () => {
    expect(is.string.notEmpty("a")).toBe(true);
    expect(is.string.notEmpty(" ")).toBe(true);
    expect(is.string.notEmpty("0")).toBe(true);
    expect(is.string.notEmpty("🚀")).toBe(true);
  });

  it("rejects empty string and non-strings", () => {
    expect(is.string.notEmpty("")).toBe(false);
    expect(is.string.notEmpty(42)).toBe(false);
    expect(is.string.notEmpty(0)).toBe(false);
    expect(is.string.notEmpty(null)).toBe(false);
    expect(is.string.notEmpty(undefined)).toBe(false);
    expect(is.string.notEmpty([])).toBe(false);
    expect(is.string.notEmpty({})).toBe(false);
    expect(is.string.notEmpty(new String("x"))).toBe(false);
  });
});

describe("is.string.min", () => {
  it("accepts strings of the minimum length or more", () => {
    expect(is.string.min(3)("abc")).toBe(true);
    expect(is.string.min(3)("abcd")).toBe(true);
    expect(is.string.min(0)("")).toBe(true);
  });

  it("rejects shorter strings and non-strings", () => {
    expect(is.string.min(3)("ab")).toBe(false);
    expect(is.string.min(3)("")).toBe(false);
    expect(is.string.min(3)(42)).toBe(false);
    expect(is.string.min(3)(null)).toBe(false);
  });
});

describe("is.string.max", () => {
  it("accepts strings of the maximum length or less", () => {
    expect(is.string.max(2)("ab")).toBe(true);
    expect(is.string.max(2)("")).toBe(true);
    expect(is.string.max(2)("a")).toBe(true);
  });

  it("rejects longer strings and non-strings", () => {
    expect(is.string.max(2)("abc")).toBe(false);
    expect(is.string.max(2)(42)).toBe(false);
    expect(is.string.max(2)(null)).toBe(false);
  });
});

describe("is.string.matches", () => {
  it("accepts matching strings", () => {
    expect(is.string.matches(/^[a-z]+$/)("abc")).toBe(true);
    expect(is.string.matches(/^[a-z]+$/)("abcabc")).toBe(true);
    expect(is.string.matches(/^\d+$/)("123")).toBe(true);
  });

  it("rejects non-matching strings and non-strings", () => {
    const isLower = is.string.matches(/^[a-z]+$/);
    expect(isLower("ABC")).toBe(false);
    expect(isLower("ab1")).toBe(false);
    expect(isLower("")).toBe(false);
    expect(isLower(" ")).toBe(false);
    // a number would be coerced by RegExp.test — must NOT be accepted
    expect(isLower(42)).toBe(false);
    expect(isLower(null)).toBe(false);
    expect(isLower(undefined)).toBe(false);
    expect(isLower(["abc"])).toBe(false);
  });
});

describe("is.string.numeric", () => {
  it("accepts numeric strings", () => {
    expect(is.string.numeric("42")).toBe(true);
    expect(is.string.numeric("-4.2")).toBe(true);
    expect(is.string.numeric("4.2")).toBe(true);
    expect(is.string.numeric("0")).toBe(true);
    expect(is.string.numeric("1e3")).toBe(true);
    expect(is.string.numeric(" 42 ")).toBe(true);
  });

  it("rejects non-numeric strings and non-strings", () => {
    expect(is.string.numeric("abc")).toBe(false);
    expect(is.string.numeric("")).toBe(false);
    expect(is.string.numeric("  ")).toBe(false);
    expect(is.string.numeric("1,5")).toBe(false);
    expect(is.string.numeric("NaN")).toBe(false);
    expect(is.string.numeric(42)).toBe(false);
    expect(is.string.numeric(null)).toBe(false);
    expect(is.string.numeric(undefined)).toBe(false);
    expect(is.string.numeric([])).toBe(false);
  });
});