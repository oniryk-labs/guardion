import { describe, expect, it } from "vitest";
import { is } from "../src/index";

describe("is.object", () => {
  it("accepts non-array, non-null objects", () => {
    expect(is.object({})).toBe(true);
    expect(is.object({ a: 1 })).toBe(true);
    expect(is.object(new Date())).toBe(true);
    expect(is.object(/x/)).toBe(true);
    expect(is.object(new Map())).toBe(true);
    expect(is.object(new Set())).toBe(true);
    expect(is.object(Object.create(null))).toBe(true);
  });

  it("rejects near-misses", () => {
    expect(is.object(null)).toBe(false);
    expect(is.object(undefined)).toBe(false);
    expect(is.object([])).toBe(false);
    expect(is.object("x")).toBe(false);
    expect(is.object(42)).toBe(false);
    expect(is.object(true)).toBe(false);
    expect(is.object(() => {})).toBe(false);
    expect(is.object(Symbol("x"))).toBe(false);
    expect(is.object(42n)).toBe(false);
  });
});

describe("is.shape", () => {
  const isUser = is.shape({ name: is.string, age: is.int });

  it("accepts objects that satisfy every field", () => {
    expect(isUser({ name: "bruno", age: 30 })).toBe(true);
    expect(isUser({ name: "", age: 0 })).toBe(true);
    expect(isUser({ name: "bruno", age: 30, extra: true })).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(isUser({ name: "bruno" })).toBe(false);
    expect(isUser({ age: 30 })).toBe(false);
    expect(isUser({})).toBe(false);
  });

  it("rejects wrong field types", () => {
    expect(isUser({ name: "bruno", age: "30" })).toBe(false);
    expect(isUser({ name: "bruno", age: null })).toBe(false);
    expect(isUser({ name: "bruno", age: 30.5 })).toBe(false);
    expect(isUser({ name: 42, age: 30 })).toBe(false);
    expect(isUser({ name: null, age: 30 })).toBe(false);
  });

  it("rejects non-object values", () => {
    expect(isUser(null)).toBe(false);
    expect(isUser(undefined)).toBe(false);
    expect(isUser([1, 2])).toBe(false);
    expect(isUser("x")).toBe(false);
    expect(isUser(42)).toBe(false);
  });

  it("supports optional fields (absent or undefined)", () => {
    const isWithOptional = is.shape({ name: is.string, age: is.optional(is.int) });
    expect(isWithOptional({ name: "bruno" })).toBe(true);
    expect(isWithOptional({ name: "bruno", age: 30 })).toBe(true);
    expect(isWithOptional({ name: "bruno", age: undefined })).toBe(true);
    expect(isWithOptional({ name: "bruno", age: "x" })).toBe(false);
    expect(isWithOptional({})).toBe(false);
  });

  it("supports nested shapes", () => {
    const isProfile = is.shape({
      user: is.shape({ name: is.string }),
      tags: is.array.of(is.string),
      role: is.union(is.literal("admin"), is.literal("user")),
    });
    expect(isProfile({ user: { name: "bruno" }, tags: ["a"], role: "admin" })).toBe(true);
    expect(isProfile({ user: { name: "bruno" }, tags: [], role: "user" })).toBe(true);
    expect(isProfile({ user: { name: 42 }, tags: [], role: "admin" })).toBe(false);
    expect(isProfile({ user: { name: "bruno" }, tags: [1], role: "admin" })).toBe(false);
    expect(isProfile({ user: { name: "bruno" }, tags: [], role: "root" })).toBe(false);
  });

  it("supports an empty schema", () => {
    const isAnything = is.shape({});
    expect(isAnything({})).toBe(true);
    expect(isAnything({ a: 1 })).toBe(true);
    expect(isAnything([])).toBe(false);
    expect(isAnything(null)).toBe(false);
  });

  it("rejects values whose shape guard is undefined", () => {
    const isDateShape = is.shape({ d: is.date });
    expect(isDateShape({ d: new Date() })).toBe(true);
    expect(isDateShape({ d: "2024-01-01" })).toBe(false);
  });
});