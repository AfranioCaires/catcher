# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - 2026-05-18

### Fixed

- **Robust Status Handling**: Fixed a critical bug where throwing `undefined` or `null` was incorrectly treated as a successful operation.
- **Type Narrowing**: Fixed an issue where destructuring `Result` as an object `{ data, error }` or tuple `[error, data]` would lose type narrowing.

### Changed

- **Refactored Result Type**: Refactored `Result` from an `Iterable` union to a true tuple union `[E, undefined] | [undefined, T]`. This provides perfect TypeScript narrowing during destructuring.
- **Improved catchError Overloads**: Added overloads to `catchError`, `fromPromise`, and `catchErrorWithTimeout` to better handle both Promise instances and function references.
- **Default Error Types**: Changed the default error type `E` from `any` to `Error` across the library for better type safety.
- **Batch Operations**: Improved return type inference for `catchErrorAll` and `catchErrorAllSync`.

## [1.0.0] - 2026-05-16

### Added

- Initial release of Catcher.
- Core `catchError` for asynchronous operations.
- Core `catchErrorSync` for synchronous operations.
- Fluent `Result` API with methods like `map`, `andThen`, `orElse`, `tap`, etc.
- Dual API support: Destructuring (tuple) and Object API.
- TypeScript 6 support with optimized type definitions.
- Monorepo structure managed by pnpm.
- High-performance linting and formatting with Oxc.
- Comprehensive documentation site.
