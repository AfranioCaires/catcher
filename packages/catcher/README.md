# Catch Error Lib

A production-ready TypeScript utility for clean error handling using the Result pattern. Supports both async and sync operations with a fluent API.

## Features

- 🛠 **Dual API**: Use destructuring (tuple/object) or fluent methods.
- ⚡ **Sync & Async**: Support for `catchError` and `catchErrorSync`.
- 🛡 **Non-Error support**: Safely catches strings, objects, or any thrown value.
- 📦 **Zero Dependencies**: Lightweight and fast.
- TypeScript first.

## Installation

```bash
npm install catch-error-lib
```

## Usage

### Basic Destructuring (Async)

```typescript
import { catchError } from "catch-error-lib";

const [error, data] = await catchError(fetchUser(1));
if (error) {
  console.error("Failed to fetch user:", error);
  return;
}
console.log(data.name);
```

### Fluent API

```typescript
const result = await catchError(fetchData());

if (result.isOk()) {
  console.log(result.data);
}

const data = result.getOrElse(defaultData);
const value = result.unwrap(); // Throws if result is error
```

### Synchronous Operations

```typescript
import { catchErrorSync } from "catch-error-lib";

const [error, config] = catchErrorSync(() => JSON.parse(rawJson));
```

## License

MIT
