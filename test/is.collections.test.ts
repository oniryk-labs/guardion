import { describe, expect, it } from "vitest";
import { is } from "../src/index";

describe("is.array", () => {
  it("accepts arrays", () => {
    expect(is.array([])).toBe(true);
    expect(is.array([1, 2])).toBe(true);
    expect(is.array([null])).toBe(true);
    expect(is.array([undefined])).toBe(true);
    expect(is.array(new Array(3))).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.array("x")).toBe(false);
    expect(is.array("[]")).toBe(false);
    expect(is.array({})).toBe(false);
    expect(is.array({ length: 0 })).toBe(false);
    expect(is.array(null)).toBe(false);
    expect(is.array(undefined)).toBe(false);
    expect(is.array(42)).toBe(false);
    expect(is.array(new Uint8Array(0))).toBe(false);
    expect(is.array(new Set())).toBe(false);
  });
});

describe("is.array.of", () => {
  const isNumberArray = is.array.of(is.number);

  it("accepts homogeneous arrays", () => {
    expect(isNumberArray([1, 2, 3])).toBe(true);
    expect(isNumberArray([])).toBe(true);
    expect(isNumberArray([0, -1, 4.5])).toBe(true);
  });

  it("rejects arrays with wrong elements", () => {
    expect(isNumberArray([1, "2"])).toBe(false);
    expect(isNumberArray(["1"])).toBe(false);
    expect(isNumberArray([NaN])).toBe(false);
    expect(isNumberArray([Infinity])).toBe(false);
    expect(isNumberArray([null])).toBe(false);
    expect(isNumberArray([undefined])).toBe(false);
    expect(isNumberArray([1, [2]])).toBe(false);
  });

  it("rejects non-arrays", () => {
    expect(isNumberArray("nope")).toBe(false);
    expect(isNumberArray(null)).toBe(false);
    expect(isNumberArray(undefined)).toBe(false);
    expect(isNumberArray({})).toBe(false);
    expect(isNumberArray(42)).toBe(false);
  });
});

describe("is.array.notEmpty", () => {
  it("accepts non-empty arrays", () => {
    expect(is.array.notEmpty([1])).toBe(true);
    expect(is.array.notEmpty([0])).toBe(true);
    expect(is.array.notEmpty([null])).toBe(true);
    expect(is.array.notEmpty([[]])).toBe(true);
  });

  it("rejects empty arrays and non-arrays", () => {
    expect(is.array.notEmpty([])).toBe(false);
    expect(is.array.notEmpty("x")).toBe(false);
    expect(is.array.notEmpty(null)).toBe(false);
    expect(is.array.notEmpty({})).toBe(false);
  });
});

describe("is.array.min", () => {
  it("accepts arrays with at least the minimum length", () => {
    expect(is.array.min(2)([1, 2])).toBe(true);
    expect(is.array.min(2)([1, 2, 3])).toBe(true);
    expect(is.array.min(0)([])).toBe(true);
  });

  it("rejects shorter arrays and non-arrays", () => {
    expect(is.array.min(2)([1])).toBe(false);
    expect(is.array.min(2)([])).toBe(false);
    expect(is.array.min(2)("x")).toBe(false);
    expect(is.array.min(2)(null)).toBe(false);
  });
});

describe("is.array.max", () => {
  it("accepts arrays with at most the maximum length", () => {
    expect(is.array.max(1)([1])).toBe(true);
    expect(is.array.max(1)([])).toBe(true);
    expect(is.array.max(2)([1, 2])).toBe(true);
  });

  it("rejects longer arrays and non-arrays", () => {
    expect(is.array.max(1)([1, 2])).toBe(false);
    expect(is.array.max(0)([1])).toBe(false);
    expect(is.array.max(1)("x")).toBe(false);
  });
});

describe("is.set", () => {
  it("accepts Sets", () => {
    expect(is.set(new Set())).toBe(true);
    expect(is.set(new Set([1, 2]))).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.set([])).toBe(false);
    expect(is.set({})).toBe(false);
    expect(is.set(new Map())).toBe(false);
    expect(is.set(new WeakSet())).toBe(false);
    expect(is.set(null)).toBe(false);
    expect(is.set(undefined)).toBe(false);
    expect(is.set("x")).toBe(false);
    expect(is.set(42)).toBe(false);
  });
});

describe("is.set.of", () => {
  const isNumberSet = is.set.of(is.number);

  it("accepts homogeneous Sets", () => {
    expect(isNumberSet(new Set())).toBe(true);
    expect(isNumberSet(new Set([1, 2, 3]))).toBe(true);
  });

  it("rejects Sets with wrong elements", () => {
    expect(isNumberSet(new Set([1, "2"]))).toBe(false);
    expect(isNumberSet(new Set([NaN]))).toBe(false);
    expect(isNumberSet(new Set([Infinity]))).toBe(false);
    expect(isNumberSet(new Set([null]))).toBe(false);
  });

  it("rejects non-Sets", () => {
    expect(isNumberSet([])).toBe(false);
    expect(isNumberSet({})).toBe(false);
    expect(isNumberSet(null)).toBe(false);
    expect(isNumberSet(new Map())).toBe(false);
  });
});

describe("is.map", () => {
  it("accepts Maps", () => {
    expect(is.map(new Map())).toBe(true);
    expect(is.map(new Map([["a", 1]]))).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.map({})).toBe(false);
    expect(is.map([])).toBe(false);
    expect(is.map(new Set())).toBe(false);
    expect(is.map(new WeakMap())).toBe(false);
    expect(is.map(null)).toBe(false);
    expect(is.map(undefined)).toBe(false);
    expect(is.map("x")).toBe(false);
  });
});

describe("is.record", () => {
  const isNumberRecord = is.record(is.number);

  it("accepts plain objects whose values pass", () => {
    expect(isNumberRecord({ a: 1, b: 2 })).toBe(true);
    expect(isNumberRecord({})).toBe(true);
    expect(isNumberRecord(Object.create(null))).toBe(true);
    expect(isNumberRecord({ a: 0, b: -1, c: 4.5 })).toBe(true);
  });

  it("rejects objects with wrong values", () => {
    expect(isNumberRecord({ a: 1, b: "2" })).toBe(false);
    expect(isNumberRecord({ a: NaN })).toBe(false);
    expect(isNumberRecord({ a: null })).toBe(false);
    expect(isNumberRecord({ a: [1] })).toBe(false);
  });

  it("rejects non-plain-objects", () => {
    expect(isNumberRecord([])).toBe(false);
    expect(isNumberRecord(null)).toBe(false);
    expect(isNumberRecord(undefined)).toBe(false);
    expect(isNumberRecord("x")).toBe(false);
    expect(isNumberRecord(42)).toBe(false);
    // collections must NOT be mistaken for plain records
    expect(isNumberRecord(new Map())).toBe(false);
    expect(isNumberRecord(new Set())).toBe(false);
    expect(isNumberRecord(new Date())).toBe(false);
    expect(isNumberRecord(/x/)).toBe(false);
    expect(isNumberRecord(new Number(1))).toBe(false);
  });
});