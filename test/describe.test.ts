import { describe, expect, it } from "vitest";
import { guard, is, enforce } from "../src/index";

// a plain guard without a describe, to exercise fallback messages
const isPlain = guard((value: unknown) => typeof value === "number");

describe("describe success paths (valid values)", () => {
  it("isArray.of", () => {
    expect(is.array.of(is.number).describe!([1, 2], "value")).toBeNull();
  });

  it("isSet.of", () => {
    expect(is.set.of(is.number).describe!(new Set([1, 2]), "value")).toBeNull();
  });

  it("isRecord", () => {
    expect(is.record(is.number).describe!({ a: 1 }, "value")).toBeNull();
  });

  it("isShape", () => {
    const g = is.shape({ name: is.string, age: is.int });
    expect(g.describe!({ name: "bruno", age: 30 }, "value")).toBeNull();
  });

  it("isUnion", () => {
    const g = is.union(is.string, is.number);
    expect(g.describe!("x", "value")).toBeNull();
    expect(g.describe!(42, "value")).toBeNull();
  });

  it("isOneOf", () => {
    expect(is.oneOf("a", "b").describe!("a", "value")).toBeNull();
  });

  it("isLiteral", () => {
    expect(is.literal("admin").describe!("admin", "value")).toBeNull();
  });

  it("isOptional", () => {
    const g = is.optional(is.string);
    expect(g.describe!(undefined, "value")).toBeNull();
    expect(g.describe!("x", "value")).toBeNull();
  });

  it("isNullable", () => {
    const g = is.nullable(is.string);
    expect(g.describe!(null, "value")).toBeNull();
    expect(g.describe!("x", "value")).toBeNull();
  });

  it("isInstanceOf", () => {
    expect(is.instanceOf(Date).describe!(new Date(), "value")).toBeNull();
  });
});

describe("enforce failure messages", () => {
  it("reports literal failures", () => {
    expect(() => enforce("user", is.literal("admin"))).toThrow('expected literal "admin"');
  });

  it("reports oneOf failures", () => {
    expect(() => enforce("x", is.oneOf("a", "b"))).toThrow('expected one of ["a", "b"]');
    expect(() => enforce("x", is.oneOf("a", "b"))).toThrow("received string");
  });

  it("reports union failures", () => {
    expect(() => enforce(true, is.union(is.string, is.number))).toThrow(
      "did not match any of 2 alternatives"
    );
  });

  it("reports optional failures", () => {
    expect(() => enforce(42, is.optional(is.string))).toThrow("value: expected string");
  });

  it("reports nullable failures", () => {
    expect(() => enforce(42, is.nullable(is.string))).toThrow("value: expected string");
  });

  it("reports set.of failures", () => {
    expect(() => enforce(new Set([1, "2"]), is.set.of(is.number))).toThrow("value[1]");
    expect(() => enforce([], is.set.of(is.number))).toThrow("expected Set");
  });

  it("reports array.of non-arrays", () => {
    expect(() => enforce({}, is.array.of(is.number))).toThrow("expected array");
  });

  it("reports record non-plain-objects", () => {
    expect(() => enforce(new Map(), is.record(is.number))).toThrow("expected record");
    expect(() => enforce([], is.record(is.number))).toThrow("expected record");
  });

  it("reports instanceOf failures", () => {
    expect(() => enforce({}, is.instanceOf(Date))).toThrow(
      "expected instance of Date, received object"
    );
  });

  it("reports shape non-objects", () => {
    expect(() => enforce("x", is.shape({ name: is.string }))).toThrow(
      "value: expected object"
    );
    expect(() => enforce(null, is.shape({ name: is.string }))).toThrow(
      "value: expected object"
    );
  });
});

describe("fallback messages (guards without describe)", () => {
  it("array.of falls back to guard failed", () => {
    expect(() => enforce(["x"], is.array.of(isPlain))).toThrow("value[0]: guard failed");
  });

  it("set.of falls back to guard failed", () => {
    expect(() => enforce(new Set(["x"]), is.set.of(isPlain))).toThrow(
      "value[0]: guard failed"
    );
  });

  it("record falls back to guard failed", () => {
    expect(() => enforce({ a: "x" }, is.record(isPlain))).toThrow('value["a"]: guard failed');
  });

  it("shape falls back to guard failed", () => {
    expect(() => enforce({ a: "x" }, is.shape({ a: isPlain }))).toThrow(
      "value.a: guard failed"
    );
  });

  it("optional falls back to guard failed", () => {
    expect(() => enforce("x", is.optional(isPlain))).toThrow("value: guard failed");
  });

  it("nullable falls back to guard failed", () => {
    expect(() => enforce("x", is.nullable(isPlain))).toThrow("value: guard failed");
  });
});