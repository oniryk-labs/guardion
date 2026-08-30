import { describe, expect, it } from "vitest";
import { is } from "../src/index";

describe("is.number", () => {
  it("accepts finite numbers", () => {
    expect(is.number(0)).toBe(true);
    expect(is.number(-0)).toBe(true);
    expect(is.number(42)).toBe(true);
    expect(is.number(-4.2)).toBe(true);
    expect(is.number(0.5)).toBe(true);
    expect(is.number(1e10)).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.number(NaN)).toBe(false);
    expect(is.number(Infinity)).toBe(false);
    expect(is.number(-Infinity)).toBe(false);
    expect(is.number("42")).toBe(false);
    expect(is.number("4.2")).toBe(false);
    expect(is.number("")).toBe(false);
    expect(is.number(true)).toBe(false);
    expect(is.number(false)).toBe(false);
    expect(is.number(null)).toBe(false);
    expect(is.number(undefined)).toBe(false);
    expect(is.number([])).toBe(false);
    expect(is.number({})).toBe(false);
    expect(is.number(42n)).toBe(false);
    expect(is.number(new Number(42))).toBe(false);
  });
});

describe("is.number.unsigned", () => {
  it("accepts non-negative finite numbers", () => {
    expect(is.number.unsigned(0)).toBe(true);
    expect(is.number.unsigned(5)).toBe(true);
    expect(is.number.unsigned(4.5)).toBe(true);
    expect(is.number.unsigned(1e10)).toBe(true);
  });

  it("rejects negatives and non-numbers", () => {
    expect(is.number.unsigned(-1)).toBe(false);
    expect(is.number.unsigned(-0.5)).toBe(false);
    expect(is.number.unsigned(NaN)).toBe(false);
    expect(is.number.unsigned(Infinity)).toBe(false);
    expect(is.number.unsigned("5")).toBe(false);
    expect(is.number.unsigned(null)).toBe(false);
    expect(is.number.unsigned(undefined)).toBe(false);
  });
});

describe("is.number.positive", () => {
  it("accepts numbers greater than zero", () => {
    expect(is.number.positive(1)).toBe(true);
    expect(is.number.positive(0.1)).toBe(true);
    expect(is.number.positive(5e-3)).toBe(true);
    expect(is.number.positive(1e10)).toBe(true);
  });

  it("rejects zero, negatives and non-numbers", () => {
    expect(is.number.positive(0)).toBe(false);
    expect(is.number.positive(-0)).toBe(false);
    expect(is.number.positive(-1)).toBe(false);
    expect(is.number.positive(NaN)).toBe(false);
    expect(is.number.positive(Infinity)).toBe(false);
    expect(is.number.positive("1")).toBe(false);
  });
});

describe("is.number.negative", () => {
  it("accepts numbers less than zero", () => {
    expect(is.number.negative(-1)).toBe(true);
    expect(is.number.negative(-0.5)).toBe(true);
    expect(is.number.negative(-1e10)).toBe(true);
  });

  it("rejects zero, positives and non-numbers", () => {
    expect(is.number.negative(0)).toBe(false);
    expect(is.number.negative(-0)).toBe(false);
    expect(is.number.negative(1)).toBe(false);
    expect(is.number.negative(NaN)).toBe(false);
    expect(is.number.negative(-Infinity)).toBe(false);
    expect(is.number.negative("-1")).toBe(false);
  });
});

describe("is.number.between", () => {
  it("is inclusive at both ends", () => {
    const isAge = is.number.between(18, 65);
    expect(isAge(18)).toBe(true);
    expect(isAge(65)).toBe(true);
    expect(isAge(30)).toBe(true);
    expect(isAge(18.5)).toBe(true);
    expect(isAge(64.9)).toBe(true);
  });

  it("rejects out-of-range and non-numbers", () => {
    const isAge = is.number.between(18, 65);
    expect(isAge(17)).toBe(false);
    expect(isAge(66)).toBe(false);
    expect(isAge(-5)).toBe(false);
    expect(isAge(NaN)).toBe(false);
    expect(isAge(Infinity)).toBe(false);
    expect(isAge("30")).toBe(false);
    expect(isAge(null)).toBe(false);
  });

  it("supports a point range", () => {
    const isFive = is.number.between(5, 5);
    expect(isFive(5)).toBe(true);
    expect(isFive(4)).toBe(false);
    expect(isFive(6)).toBe(false);
  });
});

describe("is.int", () => {
  it("accepts integers", () => {
    expect(is.int(0)).toBe(true);
    expect(is.int(42)).toBe(true);
    expect(is.int(-7)).toBe(true);
    expect(is.int(1e3)).toBe(true);
    expect(is.int(100000)).toBe(true);
  });

  it("rejects non-integers and non-numbers", () => {
    expect(is.int(4.2)).toBe(false);
    expect(is.int(-1.5)).toBe(false);
    expect(is.int(0.1)).toBe(false);
    expect(is.int(NaN)).toBe(false);
    expect(is.int(Infinity)).toBe(false);
    expect(is.int(-Infinity)).toBe(false);
    expect(is.int("42")).toBe(false);
    expect(is.int("4")).toBe(false);
    expect(is.int(42n)).toBe(false);
    expect(is.int(null)).toBe(false);
    expect(is.int(undefined)).toBe(false);
    expect(is.int([])).toBe(false);
    expect(is.int({})).toBe(false);
    expect(is.int(new Number(4))).toBe(false);
  });
});

describe("is.float", () => {
  it("accepts finite non-integer numbers", () => {
    expect(is.float(4.2)).toBe(true);
    expect(is.float(-1.5)).toBe(true);
    expect(is.float(0.1)).toBe(true);
    expect(is.float(0.001)).toBe(true);
  });

  it("rejects integers and non-numbers", () => {
    expect(is.float(42)).toBe(false);
    expect(is.float(-7)).toBe(false);
    expect(is.float(0)).toBe(false);
    expect(is.float(4.0)).toBe(false);
    expect(is.float(NaN)).toBe(false);
    expect(is.float(Infinity)).toBe(false);
    expect(is.float("4.2")).toBe(false);
    expect(is.float(null)).toBe(false);
    expect(is.float(undefined)).toBe(false);
  });
});