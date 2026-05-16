# Catcher

A production-ready TypeScript utility for clean error handling. Inspired by Go's error handling and Rust's Result pattern, Catcher provides a type-safe way to handle both synchronous and asynchronous operations without the verbosity of traditional try/catch blocks.

## Core Features

- Dual API: Support for both destructuring (tuple-style) and a fluent Object API.
- Async Support: Native handling for Promises with optional timeouts.
- Sync Support: Safe execution of synchronous functions.
- Non-Error Catching: Safely handles strings, objects, or any value thrown by JavaScript.
- Zero Dependencies: Lightweight footprint for any environment.
- TypeScript Native: Built for TypeScript 6 with comprehensive type safety.

## Project Structure

This repository is organized as a monorepo using pnpm workspaces:

- `packages/catcher`: The core library (@catcher/core).
- `packages/docs`: The official documentation and examples.

## Getting Started

### Installation

```bash
pnpm add @catcher/core
```

### Basic Usage

```typescript
import { catchError } from '@catcher/core';

const [error, data] = await catchError(fetchUser(id));

if (error) {
  console.error('Failed to fetch user', error);
  return;
}

console.log('User data:', data);
```

## Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build all packages:
   ```bash
   pnpm build
   ```

3. Run tests:
   ```bash
   pnpm test
   ```

4. Lint and Format (using Oxc):
   ```bash
   pnpm lint
   pnpm format
   ```

## Documentation

For full documentation, visit the `packages/docs` directory or check the package-specific README in `packages/catcher/README.md`.

## License

MIT
