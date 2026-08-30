import { describe, expect, it } from "vitest";
import { is } from "../src/index";

describe("is.date", () => {
  it("accepts Date instances", () => {
    expect(is.date(new Date())).toBe(true);
    expect(is.date(new Date(0))).toBe(true);
    expect(is.date(new Date("2024-01-01"))).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.date(Date.now())).toBe(false);
    expect(is.date("2024-01-01")).toBe(false);
    expect(is.date({})).toBe(false);
    expect(is.date(null)).toBe(false);
    expect(is.date(undefined)).toBe(false);
    expect(is.date([])).toBe(false);
    expect(is.date(42)).toBe(false);
  });
});

describe("is.regexp", () => {
  it("accepts RegExp instances", () => {
    expect(is.regexp(/x/)).toBe(true);
    expect(is.regexp(new RegExp("x"))).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.regexp("x")).toBe(false);
    expect(is.regexp(/x/.source)).toBe(false);
    expect(is.regexp({})).toBe(false);
    expect(is.regexp(null)).toBe(false);
    expect(is.regexp(undefined)).toBe(false);
    expect(is.regexp([])).toBe(false);
    expect(is.regexp(42)).toBe(false);
  });
});

describe("is.error", () => {
  it("accepts Error instances and subclasses", () => {
    expect(is.error(new Error())).toBe(true);
    expect(is.error(new TypeError())).toBe(true);
    expect(is.error(new RangeError())).toBe(true);
    expect(is.error(new SyntaxError())).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.error({})).toBe(false);
    expect(is.error({ message: "boom" })).toBe(false);
    expect(is.error("boom")).toBe(false);
    expect(is.error(null)).toBe(false);
    expect(is.error(undefined)).toBe(false);
    expect(is.error([])).toBe(false);
    expect(is.error(42)).toBe(false);
  });
});

describe("is.symbol", () => {
  it("accepts symbols", () => {
    expect(is.symbol(Symbol())).toBe(true);
    expect(is.symbol(Symbol("x"))).toBe(true);
    expect(is.symbol(Symbol.iterator)).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.symbol("x")).toBe(false);
    expect(is.symbol(42)).toBe(false);
    expect(is.symbol({})).toBe(false);
    expect(is.symbol(null)).toBe(false);
    expect(is.symbol(undefined)).toBe(false);
    expect(is.symbol([])).toBe(false);
    expect(is.symbol(true)).toBe(false);
    expect(is.symbol(42n)).toBe(false);
  });
});

describe("is.bigint", () => {
  it("accepts bigints", () => {
    expect(is.bigint(10n)).toBe(true);
    expect(is.bigint(0n)).toBe(true);
    expect(is.bigint(-1n)).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.bigint(10)).toBe(false);
    expect(is.bigint(10.5)).toBe(false);
    expect(is.bigint("10")).toBe(false);
    expect(is.bigint({})).toBe(false);
    expect(is.bigint(null)).toBe(false);
    expect(is.bigint(undefined)).toBe(false);
    expect(is.bigint([])).toBe(false);
    expect(is.bigint(true)).toBe(false);
  });
});

describe("is.promise", () => {
it("accepts Promise instances", () => {
    expect(is.promise(Promise.resolve())).toBe(true);
    expect(is.promise(new Promise(() => {}))).toBe(true);
    expect(is.promise(Promise.resolve().then(() => {}))).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.promise({})).toBe(false);
    expect(is.promise([])).toBe(false);
    expect(is.promise(null)).toBe(false);
    expect(is.promise(undefined)).toBe(false);
    expect(is.promise("x")).toBe(false);
    expect(is.promise(async () => {})).toBe(false);
    expect(is.promise(() => {})).toBe(false);
    // a thenable is not a Promise
    expect(is.promise({ then() {} })).toBe(false);
  });
});

describe("is.callable", () => {
  it("accepts callables", () => {
    expect(is.callable(() => {})).toBe(true);
    expect(is.callable(function () {})).toBe(true);
    expect(is.callable(class Foo {})).toBe(true);
    expect(is.callable(async () => {})).toBe(true);
    expect(is.callable(function* () {})).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.callable(42)).toBe(false);
    expect(is.callable({})).toBe(false);
    expect(is.callable([])).toBe(false);
    expect(is.callable(null)).toBe(false);
    expect(is.callable(undefined)).toBe(false);
    expect(is.callable("x")).toBe(false);
    expect(is.callable(true)).toBe(false);
  });
});

describe("is.instanceOf", () => {
  class Animal {}
  class Dog extends Animal {}

  it("accepts instances of the class", () => {
    expect(is.instanceOf(Animal)(new Animal())).toBe(true);
    expect(is.instanceOf(Dog)(new Dog())).toBe(true);
    expect(is.instanceOf(Animal)(new Dog())).toBe(true);
    expect(is.instanceOf(Error)(new TypeError())).toBe(true);
    expect(is.instanceOf(Array)([])).toBe(true);
  });

  it("rejects non-instances", () => {
    expect(is.instanceOf(Animal)({})).toBe(false);
    expect(is.instanceOf(Animal)(null)).toBe(false);
    expect(is.instanceOf(Animal)(undefined)).toBe(false);
    expect(is.instanceOf(Dog)(new Animal())).toBe(false);
    expect(is.instanceOf(Array)({})).toBe(false);
    expect(is.instanceOf(Array)("x")).toBe(false);
  });
});