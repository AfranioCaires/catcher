# @catcher/core

A production-ready TypeScript utility for clean error handling. Inspired by Go's explicit error handling and Rust's Result pattern, Catcher helps you write safer, more readable code by treating errors as values.

## Features

- Dual API: Use destructuring (tuple/Go-style) or a fluent Object API.
- Sync and Async: Native support for catchError and catchErrorSync.
- Non-Error support: Safely catches strings, objects, or any thrown value.
- Zero Dependencies: Lightweight and fast.
- TypeScript First: Built with TypeScript 6 for excellent type safety and IDE support.

## Installation

```bash
pnpm add @catcher/core
# or
npm install @catcher/core
```

## Core Concepts

### Destructuring (Tuple API)

This approach mimics the error handling style found in languages like Go.

```typescript
import { catchErrorSync } from '@catcher/core'

const [error, data] = catchErrorSync(() => JSON.parse('{"valid": true}'))

if (error) {
  console.error('Parse failed', error)
  return
}

console.log(data.valid)
```

### Fluent Object API

This approach uses fluent methods to check the status and retrieve values.

```typescript
import { catchError } from '@catcher/core'

const result = await catchError(fetchUser(1))

if (result.isOk()) {
  console.log(result.data.name)
} else {
  console.error(result.error)
}
```

## API Reference

### Async Operations

#### catchError(promise, errorsToCatch?)

Wraps a Promise and returns a standardized Result object.

```typescript
const [error, data] = await catchError(
  fetch('https://api.example.com/data').then((res) => res.json()),
)
```

#### catchErrorWithTimeout(promise, timeoutMs, errorsToCatch?)

Handles operations that might hang by adding a timeout.

```typescript
const [error, data] = await catchErrorWithTimeout(fetchData(), 5000)
```

### Sync Operations

#### catchErrorSync(fn, errorsToCatch?)

Executes a synchronous function and catches any errors.

```typescript
const [error, data] = catchErrorSync(() => JSON.parse(rawJson))
```

### Result API

The Result object provides a rich set of methods for chaining and transforming data:

- isOk() / isErr(): Type guards to check the status.
- unwrap(): Returns data or throws the error.
- getOrElse(fallback): Returns data or a default value.
- map(fn): Transforms successful data.
- mapErr(fn): Transforms errors.
- andThen(fn): Chains another operation that returns a Result.
- orElse(fn): Recovers from an error.
- tap(fn) / tapErr(fn): Triggers side-effects (e.g., logging).
- toPromise(): Converts the Result back to a Promise.

## Contributing

Please see our Contributing Guide for details on how to get started.

## License

MIT
