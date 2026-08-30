import { describe, expect, it } from "vitest";
import * as api from "../src/index";
import type { Guard } from "../src/index";

const namespaceKeys = [
  "int",
  "float",
  "number",
  "null",
  "object",
  "array",
  "defined",
  "string",
  "instanceOf",
  "set",
  "map",
  "date",
  "regexp",
  "error",
  "symbol",
  "bigint",
  "promise",
  "callable",
  "any",
  "truthy",
  "falsy",
  "bool",
  "boolean",
  "oneOf",
  "literal",
  "union",
  "all",
  "not",
  "optional",
  "nullable",
  "shape",
  "record",
  "undefined",
  "register",
] as const;

describe("public API", () => {
  it("exports the expected surface", () => {
    expect(api.is).toBeDefined();
    expect(api.enforce).toBeTypeOf("function");
    expect(api.GuardianError).toBeTypeOf("function");
    expect(api.guard).toBeTypeOf("function");
    expect(api.createIs).toBeTypeOf("function");
  });

  it("exposes every helper on the is namespace", () => {
    for (const key of namespaceKeys) {
      expect(api.is, `is.${key}`).toHaveProperty(key);
    }
  });

  it("exposes helper functions on composite guards", () => {
    expect(api.is.number).toHaveProperty("unsigned");
    expect(api.is.number).toHaveProperty("positive");
    expect(api.is.number).toHaveProperty("negative");
    expect(api.is.number).toHaveProperty("between");
    expect(api.is.string).toHaveProperty("notEmpty");
    expect(api.is.string).toHaveProperty("min");
    expect(api.is.string).toHaveProperty("max");
    expect(api.is.string).toHaveProperty("matches");
    expect(api.is.string).toHaveProperty("numeric");
    expect(api.is.array).toHaveProperty("of");
    expect(api.is.array).toHaveProperty("notEmpty");
    expect(api.is.array).toHaveProperty("min");
    expect(api.is.array).toHaveProperty("max");
    expect(api.is.set).toHaveProperty("of");
  });

  it("narrows types", () => {
    const value: unknown = "hello";
    const foo: string = api.enforce(value, api.is.string);
    expect(foo).toBe("hello");
  });

  it("Guard is exported as a type", () => {
    const g: Guard<number> = api.is.number;
    expect(g(1)).toBe(true);
  });
});