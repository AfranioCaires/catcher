---
name: catcher
description: >
    Complete usage guide for the Catcher library for error handling with the Result pattern (Ok/Err) in TypeScript.
    Use this skill ALWAYS whenever the user mentions catchError, catchErrorSync, catchErrorAll, Result, ok(), err(), combine, fromNullable, fromThrowable, fromPromise, or asks to handle errors without try/catch in TypeScript.
    Also trigger when the user wants to convert Promises to Result, chain operations that can fail, combine multiple results, or use the Railway-Oriented Programming (ROP) pattern in the project.
---

# Catcher - Usage Guide

TypeScript library for functional error handling using the Result<T, E> type.
Eliminates try/catch blocks scattered throughout the code and makes the error flow explicit and composable.

## Imports

```ts
import {
    catchError, catchErrorSync, catchErrorWithTimeout,
    catchErrorAll, catchErrorAllSync,
    combine, combineAll, partition,
    fromNullable, fromThrowable, fromPromise,
    ok, err,
    Result, AsyncResult,
} from "Catcher";
```

---

## 1. Fundamental Types

| Type | Description |
|------|-----------|
| Result<T, E> | Success (ok) or failure (err) |
| AsyncResult<T, E> | Promise<Result<T, E>> |
| ResultSuccess<T, E> | Success result (type guard) |
| ResultFailure<T, E> | Failure result (type guard) |

```ts
const success = ok(42);
const failure = err(new Error("Oops"));
```

---

## 2. Catching Errors

### catchError - Promise → Result

```ts
const result = await catchError(fetch("/api/data"));

const result2 = await catchError(fetchUser(id), [NetworkError, TimeoutError]);
```

### catchErrorWithTimeout - with timeout

```ts
const result = await catchErrorWithTimeout(longOperation(), 5000);
```

### catchErrorSync - synchronous function → Result

```ts
const result = catchErrorSync(() => JSON.parse(rawJson));
const result2 = catchErrorSync(() => riskyOp(), [TypeError]);
```

---

## 3. Checking and Extracting the Result

```ts
const result = await catchError(getUser(id));

if (result.isOk())  console.log(result.data);
if (result.isErr()) console.log(result.error);

const [error, data] = result;
if (error) { /* handle error */ }

result.data;
result.error;

const data = result.unwrap();
const error = result.unwrapErr();

const value = result.getOrElse(0);
```

---

## 4. Chaining (Fluent API)

```ts
const result = await catchError(getUser(id))
    .then(r => r
        .map(user => user.name.toUpperCase())
        .mapErr(e => new AppError("User not found"))
        .andThen(name => validateName(name))
        .tap(name => console.log("Name:", name))
        .tapErr(e => logger.error(e))
        .getOrElse("Anonymous")
    );
```

| Method | When to use |
|--------|-------------|
| .map(fn) | Transform the success value |
| .mapErr(fn) | Transform the error |
| .andThen(fn) / .flatMap(fn) | Chain operation that returns Result |
| .orElse(fn) | Recover from an error with a new Result |
| .tap(fn) | Side-effect on success (log, cache, etc.) |
| .tapErr(fn) | Side-effect on error |
| .toPromise() | Convert back to Promise (rejects if err) |

---

## 5. Batch Operations

### catchErrorAll - multiple Promises in parallel

```ts
const [r1, r2] = await catchErrorAll([
    fetchUser(1),
    fetchPosts(1),
]);

const results = await catchErrorAll([
    fetchUser(1),
    [fetchProfile(1), [NetworkError]],
    [fetchSettings(1), [DBError], (e) => defaultSettings],
    {
        promise: longQuery(),
        timeoutMs: 3000,
        errorsToCatch: [TimeoutError],
        handler: (e) => [],
    },
]);
```

### catchErrorAllSync - multiple synchronous functions

```ts
const [r1, r2, r3] = catchErrorAllSync([
    () => JSON.parse(a),
    [() => JSON.parse(b), [SyntaxError]],
    { fn: () => riskyOp(), handler: (e) => fallback },
]);
```

---

## 6. Combinators

### combine - stops at the first error

```ts
const result = combine([r1, r2, r3]);
```

### combineAll - collects all errors

```ts
const result = combineAll([r1, r2, r3]);
```

### partition - separates ok and err

```ts
const { ok: users, err: failures } = partition(results);
```

---

## 7. Utilities (Helpers)

### fromNullable - null/undefined → Result

```ts
const result = fromNullable(cache.get(key), new CacheError("miss"));
```

### fromThrowable - wraps function that might throw

```ts
const safeParseJSON = fromThrowable(JSON.parse, [SyntaxError]);
const result = safeParseJSON('{"ok": true}');
```

### fromPromise - readable alias for catchError

```ts
const result = await fromPromise(axios.get("/api"), [AxiosError]);
```

---

## 8. Common Patterns

### Sequential Chaining (Railway)

```ts
async function registerUser(dto: RegisterDTO): AsyncResult<User, AppError> {
    const emailResult = await catchError(checkEmailAvailable(dto.email));
    if (emailResult.isErr()) return err(new AppError("Email in use"));

    const hashResult = catchErrorSync(() => bcrypt.hashSync(dto.password, 10));
    if (hashResult.isErr()) return err(new AppError("Error generating hash"));

    return catchError(db.user.create({ ...dto, password: hashResult.data }));
}
```

### Parallel operations with fallback

```ts
const [userResult, prefsResult] = await catchErrorAll([
    fetchUser(id),
    { promise: fetchPrefs(id), handler: () => defaultPrefs },
]);

if (userResult.isErr()) return handleError(userResult.error);
const user = userResult.data;
const prefs = prefsResult.getOrElse(defaultPrefs);
```

### Validation accumulating errors

```ts
const results = catchErrorAllSync([
    [() => validateName(dto.name),   [ValidationError]],
    [() => validateEmail(dto.email), [ValidationError]],
    [() => validateAge(dto.age),     [ValidationError]],
]);

const { err: errors } = partition(results);
if (errors.length > 0) return err(errors);
```
