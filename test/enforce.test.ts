import { describe, expect, it } from "vitest";
import { GuardianError, is, enforce } from "../src/index";

describe("enforce", () => {
  it("returns the value unchanged when the guard passes", () => {
    const value: unknown = { name: "bruno", age: 30 };
    const result = enforce(value, is.shape({ name: is.string, age: is.int }));
    expect(result).toBe(value);
  });

  it("narrows the type", () => {
    const value: unknown = 42;
    const result: number = enforce(value, is.number);
    expect(result * 2).toBe(84);
  });

  it("throws GuardianError when the guard fails", () => {
    expect(() => enforce(42, is.string)).toThrow(GuardianError);
    expect(() => enforce(42, is.string)).toThrowError(GuardianError);
  });

  it("includes the expected type in the error message", () => {
    expect(() => enforce(42, is.string)).toThrow("expected string");
    expect(() => enforce("x", is.int)).toThrow("expected integer");
    expect(() => enforce(null, is.number)).toThrow("expected finite number");
  });

  it("reports the failing path for shapes", () => {
    const isUser = is.shape({ name: is.string, age: is.int });
    expect(() => enforce({ name: "bruno", age: "x" }, isUser)).toThrow("value.age");
    expect(() => enforce({ name: "bruno", age: "x" }, isUser)).toThrow("expected integer");
    expect(() => enforce({ name: 42, age: 30 }, isUser)).toThrow("value.name");
    expect(() => enforce({ name: "bruno" }, isUser)).toThrow("value.age");
  });

  it("reports the failing index for arrays", () => {
    expect(() => enforce([1, "x", 3], is.array.of(is.number))).toThrow("value[1]");
    expect(() => enforce([1, "x", 3], is.array.of(is.number))).toThrow("expected finite number");
    expect(() => enforce("nope", is.array.of(is.number))).toThrow("expected array");
  });

  it("reports the failing key for records", () => {
    expect(() => enforce({ a: 1, b: "x" }, is.record(is.number))).toThrow('value["b"]');
  });

  it("reports nested paths", () => {
    const isProfile = is.shape({
      user: is.shape({ name: is.string }),
      tags: is.array.of(is.int),
    });
    expect(() => enforce({ user: { name: 42 }, tags: [] }, isProfile)).toThrow(
      "value.user.name"
    );
    expect(() => enforce({ user: { name: "a" }, tags: [1, "x"] }, isProfile)).toThrow(
      "value.tags[1]"
    );
  });

  it("prefers a custom message", () => {
    expect(() => enforce(42, is.string, "must be a string")).toThrow("must be a string");
    expect(() => enforce(42, is.string, "must be a string")).toThrow(GuardianError);
  });

  it("supports registered guards", () => {
    const isPositive = is.number.positive;
    expect(enforce(5, isPositive)).toBe(5);
    expect(() => enforce(-1, isPositive)).toThrow("expected positive number");
  });
});