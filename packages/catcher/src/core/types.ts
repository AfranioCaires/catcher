/**
 * Methods available on both Success and Failure Result objects.
 * Provides a fluent API for chaining, transforming, and recovering from errors.
 */
export interface ResultMethods<T, E> {
  /**
   * Returns true if the result is a success (ok).
   * Acts as a type guard for ResultSuccess.
   */
  isOk(): this is ResultSuccess<T, E>

  /**
   * Returns true if the result is a failure (err).
   * Acts as a type guard for ResultFailure.
   */
  isErr(): this is ResultFailure<T, E>

  /**
   * Returns the contained data if success.
   * @throws The contained error if the result is a failure.
   */
  unwrap(): T

  /**
   * Returns the contained error if failure.
   * @throws The contained data if the result is a success.
   */
  unwrapErr(): E

  /**
   * Returns the contained data if success, or a provided default value if failure.
   * @param defaultValue The value to return if the result is a failure.
   */
  getOrElse<D>(defaultValue: D): T | D

  /**
   * Transforms the success data using the provided function.
   * If the result is a failure, it returns the failure as-is.
   * @param fn Function to transform the success data.
   */
  map<U>(fn: (data: T) => U): Result<U, E>

  /**
   * Transforms the error using the provided function.
   * If the result is a success, it returns the success as-is.
   * @param fn Function to transform the error.
   */
  mapErr<F>(fn: (error: E) => F): Result<T, F>

  /**
   * Chains another operation that returns a Result.
   * Useful for sequential operations that may fail.
   * @param fn Function that takes data and returns a new Result.
   */
  andThen<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F>

  /**
   * Alias for andThen. Provides compatibility with monadic patterns.
   */
  flatMap<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F>

  /**
   * Recovers from an error by returning a new Result.
   * If the result is a success, it returns the success as-is.
   * @param fn Function that takes an error and returns a new Result.
   */
  orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>

  /**
   * Executes a side effect if the result is a success.
   * Returns the original Result unchanged.
   * @param fn Side effect function.
   */
  tap(fn: (data: T) => void): Result<T, E>

  /**
   * Executes a side effect if the result is a failure.
   * Returns the original Result unchanged.
   * @param fn Side effect function.
   */
  tapErr(fn: (error: E) => void): Result<T, E>

  /**
   * Converts the Result into a Promise.
   * Resolves with data on success, rejects with error on failure.
   */
  toPromise(): Promise<T>
}

/**
 * Represents a successful operation result.
 */
export type ResultSuccess<T, E = never> = {
  readonly error: undefined
  readonly data: T
  readonly 0: undefined
  readonly 1: T
} & ResultMethods<T, E> & [undefined, T]

/**
 * Represents a failed operation result.
 */
export type ResultFailure<T, E> = {
  readonly error: E
  readonly data: undefined
  readonly 0: E
  readonly 1: undefined
} & ResultMethods<T, E> & [E, undefined]

/**
 * Discriminated union representing either success (ok) or failure (err).
 * Narrowed by checking the `error` property or using `isOk()` / `isErr()` methods.
 */
export type Result<T, E = Error> = ResultSuccess<T, E> | ResultFailure<T, E>

/**
 * Utility type for Results wrapped in a Promise.
 */
export type AsyncResult<T, E = any> = Promise<Result<T, E>>
