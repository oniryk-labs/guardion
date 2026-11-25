# @oniryk/guardion

> Runtime safety for TypeScript — prove the shape of your data at runtime, not just at compile time.

`@oniryk/guardion` validates untrusted data — an API response, a `JSON.parse`, a form, anything that arrives as `any` or `unknown`. You describe the expected shape with the `is` vocabulary, and `enforce` checks the value against it: the value comes back narrowed, or `enforce` throws a `GuardianError` pointing to the exact field that failed. No `as`, no silent mismatches.

## Why

- **Checked where you call it** — you decide where data is verified, so a failure surfaces exactly there, not later.
- **No `as`, no guesswork** — `enforce` returns a genuinely narrowed value, or throws.
- **Errors that point** — the failing field or index is in the message.
- **Strict by default** — near-misses are rejected, never silently coerced.

## Installation

```bash
npm install @oniryk/guardion
```

## Quick start

```ts
import { is, enforce } from "@oniryk/guardion";

// the value MUST be a string — otherwise this throws
const id = enforce(payload.id, is.string);

// the payload MUST match the shape — otherwise this throws
const user = enforce(payload, is.shape({ name: is.string.notEmpty, age: is.int }));

// after enforce, the value is narrowed: user.name is a string
user.name.toUpperCase();
```

## API

### `enforce(value, guard, message?)` — the main API

Validates `value` against a guard and **returns it narrowed**. If it fails, throws a `GuardianError`.

```ts
import { enforce, is } from "@oniryk/guardion";

const user = enforce(data, isUser);       // user: { id: string; name: string; ... }
const age = enforce(input.age, is.int);   // age: number
const status = enforce(input.status, is.oneOf("active", "inactive"));
```

Error messages point to the exact failure path:

```
GuardianError: value.age: expected integer, received string
GuardianError: value.tags[1]: expected finite number, received string
GuardianError: value.user.name: expected string, received number
```

You can override the message with the third argument:

```ts
enforce(input, is.string, "field must be a string");
```

### `GuardianError`

Exported error class — use it for precise `try/catch` handling.

```ts
import { GuardianError, enforce, is } from "@oniryk/guardion";

try {
  enforce(data, isUser);
} catch (error) {
  if (error instanceof GuardianError) {
    console.error(error.message);
  }
}
```

### `Guard<T>` — the building block

A guard is just a type predicate function. This is what `enforce` consumes.

```ts
type Guard<T> = (value: unknown) => value is T;
```

### `guard(predicate)` — the low-level helper

Builds a `Guard<T>` from a predicate, for when the `is` vocabulary is not enough.

```ts
import { guard } from "@oniryk/guardion";

const isPositive = guard<number>((value) => typeof value === "number" && value > 0);

const price = enforce(input.price, isPositive); // throws if not a positive number
```

### `InferGuard<T>` — getting the type back

Extracts the narrowed type from a guard value, so you can define the guard once and reuse its type elsewhere.

```ts
import { is, type InferGuard } from "@oniryk/guardion";

const isOrder = is.shape({
  id: is.string.notEmpty,
  quantity: is.int,
  price: is.number.positive,
});

type Order = InferGuard<typeof isOrder>;
// { id: string; quantity: number; price: number }
```

It works with any type predicate, not only guards. Non-predicate types resolve to `never`:

```ts
type Name = InferGuard<(value: unknown) => value is string>; // string
type Nope = InferGuard<(value: unknown) => boolean>;         // never
```

## The `is` vocabulary

These are the pieces you compose to describe a value's shape. Every guard also works standalone as a type predicate.

### Primitives

| Guard | Validates |
| --- | --- |
| `is.string` | string |
| `is.number` | finite number |
| `is.int` | integer |
| `is.float` | finite non-integer number |
| `is.boolean` / `is.bool` | boolean |
| `is.null` | `null` |
| `is.undefined` | `undefined` |
| `is.defined` | any value except `null`/`undefined` |
| `is.symbol` | `symbol` |
| `is.bigint` | `bigint` |
| `is.any` | any value |

### Objects and collections

| Guard | Validates |
| --- | --- |
| `is.object` | non-null, non-array object |
| `is.record(guard)` | plain object whose values pass `guard` |
| `is.shape(schema)` | object with typed fields (see below) |
| `is.array` | array |
| `is.array.of(guard)` | array whose elements pass `guard` |
| `is.set` | `Set` |
| `is.set.of(guard)` | `Set` whose elements pass `guard` |
| `is.map` | `Map` |

### Runtime types

| Guard | Validates |
| --- | --- |
| `is.date` | `Date` |
| `is.regexp` | `RegExp` |
| `is.error` | `Error` (and subclasses) |
| `is.promise` | `Promise` |
| `is.callable` | function (includes classes) |
| `is.instanceOf(Ctor)` | instance of `Ctor` |

### Composers

| Guard | Validates |
| --- | --- |
| `is.oneOf("a", "b", ...)` | one of the literal values |
| `is.literal(v)` | exactly the value `v` (`Object.is` semantics) |
| `is.union(...guards)` | any of the guards |
| `is.all(...guards)` | all of the guards |
| `is.not(guard)` | any value that does **not** pass `guard` |
| `is.optional(guard)` | `guard` or `undefined` |
| `is.nullable(guard)` | `guard` or `null` |

### Nested guards

Some guards expose variations as properties, so you compose tighter contracts inline:

```ts
is.string.notEmpty;                 // non-empty string
is.string.min(3);                   // string with length >= 3
is.string.max(10);                  // string with length <= 10
is.string.matches(/^[a-z]+$/);      // string matching the regex
is.string.numeric;                  // string representing a number

is.number.unsigned;                 // number >= 0
is.number.positive;                 // number > 0
is.number.negative;                 // number < 0
is.number.between(18, 65);          // number in the closed interval

is.array.notEmpty;                  // non-empty array
is.array.min(2);                    // array with length >= 2
is.array.max(10);                   // array with length <= 10
is.array.of(is.number);             // array of numbers

is.set.of(is.string);               // Set of strings
```

### `is.shape(schema)` — per-field contracts

The workhorse for describing objects. Each schema key maps to a guard, and the result is a `Guard` with the inferred type:

```ts
const isUser = is.shape({
  id: is.string,
  name: is.string.notEmpty,
  age: is.int,
  email: is.optional(is.string),
  tags: is.array.of(is.string),
});

const user = enforce(data, isUser);
// user: { id: string; name: string; age: number; email?: string; tags: string[] }
```

- Extra keys on the object are ignored.
- Fields using `is.optional(x)` accept a missing key, an explicit `undefined`, or a valid value.
- Schemas nest freely: `is.shape({ user: is.shape({ name: is.string }) })`.

## No false positives

Guards reject near-misses that would otherwise pass silently:

- `NaN` / `Infinity` are not valid numbers.
- `new String("x")` is not a string.
- `Map` / `Set` / `Date` / class instances are not plain records.
- Thenables are not Promises.
- `RegExp.test` coercion never kicks in for non-strings.

## Extending with your own guards

Register new guards on the `is` namespace:

```ts
import { guard, is } from "@oniryk/guardion";

is.register("email", is.string.matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/));

const email = enforce(input, is.email); // throws if it's not a valid email
```

To get the type on `is.email`, use TypeScript *declaration merging*:

```ts
// email.d.ts
import type { Guard } from "@oniryk/guardion";

declare module "@oniryk/guardion" {
  interface Is {
    email: Guard<string>;
  }
}
```

### `createIs()`

Creates an independent instance of the `is` namespace — registrations on it do not affect the global singleton.

```ts
import { createIs, guard } from "@oniryk/guardion";

const customIs = createIs();
customIs.register("even", guard((v) => typeof v === "number" && v % 2 === 0));

const even = enforce(input, customIs.even); // via cast, or after declaration merging
```

## License

MIT