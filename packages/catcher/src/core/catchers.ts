import { err, ok } from './factories'
import { Result } from './types'

/**
 * Executes a Promise or a function that returns a Promise and wraps its outcome in a Result.
 * @param promiseOrFn The Promise or function to execute.
 * @param errorsToCatch Optional array of Error classes to catch.
 */
export async function catchError<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(promise: Promise<T>, errorsToCatch?: E[]): Promise<Result<T, InstanceType<E>>>
export async function catchError<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(fn: () => T | Promise<T>, errorsToCatch?: E[]): Promise<Result<T, InstanceType<E>>>
/**
 * Executes a promise or a function and wraps the outcome in a `Result`, optionally catching only specified error classes.
 *
 * @param promiseOrFn - A `Promise` or a function that returns either a value or a `Promise` of a value.
 * @param errorsToCatch - Optional array of `Error` constructor functions; if omitted or empty, caught errors are wrapped. If provided, only errors that are instances of any of these classes are wrapped; other errors are rethrown.
 * @returns A `Result` that is `ok(value)` when the operation succeeds, or `err(error)` when a caught error is thrown.
 */
export async function catchError<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E>>> {
  try {
    const data = await (typeof promiseOrFn === 'function' ? (promiseOrFn as Function)() : promiseOrFn)
    return ok(data) as any
  } catch (error: any) {
    if (
      !errorsToCatch ||
      errorsToCatch.length === 0 ||
      errorsToCatch.some((cls) => error instanceof cls)
    ) {
      return err(error) as any
    }
    throw error
  }
}

/**
 * Execute an operation with a timeout and return its outcome wrapped in a `Result`.
 *
 * @param promiseOrFn - A Promise or a function that returns a value or a Promise.
 * @param timeoutMs - Maximum time to wait in milliseconds before the operation is considered timed out.
 * @param errorsToCatch - Optional array of Error classes to catch; if provided, thrown errors that are instances of any listed class (and the base `Error` for the timeout) are returned as `err`, otherwise non-matching errors are rethrown.
 * @returns A `Result` that is `ok(value)` when the operation completes successfully, or `err(error)` when the operation throws or the timeout elapses. The error will be an instance of one of the provided error classes or a generic `Error` for timeouts.
 */
export async function catchErrorWithTimeout<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  timeoutMs: number,
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E> | Error>> {
  let timeoutId: any

  try {
    const promise =
      typeof promiseOrFn === 'function'
        ? Promise.resolve().then(() => (promiseOrFn as Function)())
        : Promise.resolve(promiseOrFn)

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })

    const filters = errorsToCatch ? ([...errorsToCatch, Error] as any) : undefined
    return await catchError(Promise.race([promise, timeoutPromise]), filters)
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Executes a synchronous function and wraps its outcome in a Result.
 * @param fn The function to execute.
 * @param errorsToCatch Optional array of Error classes to catch.
 */
export function catchErrorSync<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(fn: () => T, errorsToCatch?: E[]): Result<T, InstanceType<E>> {
  try {
    const data = fn()
    return ok(data) as any
  } catch (error: any) {
    if (
      !errorsToCatch ||
      errorsToCatch.length === 0 ||
      errorsToCatch.some((cls) => error instanceof cls)
    ) {
      return err(error) as any
    }
    throw error
  }
}
