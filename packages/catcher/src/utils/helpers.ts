import { catchErrorSync, catchError } from '../core/catchers'
import { err, ok } from '../core/factories'
import { Result } from '../core/types'

/**
 * Converts a nullable value (null or undefined) into a Result.
 * @param value The value to check.
 * @param error The error to return if the value is null or undefined.
 */
export function fromNullable<T, E>(value: T | null | undefined, error: E): Result<T, E> {
  return value === null || value === undefined ? err(error) : ok(value)
}

/**
 * Wraps a synchronous function that might throw into one that returns a Result.
 * @param fn The function to wrap.
 * @param errorsToCatch Optional array of Error classes to catch. If omitted, catches all errors.
 */
export function fromThrowable<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
  Args extends any[] = any[],
>(
  fn: (...args: Args) => T,
  errorsToCatch?: E[],
): (...args: Args) => Result<T, InstanceType<E>> {
  return (...args: Args) => catchErrorSync(() => fn(...args), errorsToCatch) as any
}

/**
 * Wraps a Promise or a function that returns a Promise into a Result.
 * Alias for catchError, providing a more descriptive name for certain contexts.
 * @param promiseOrFn The promise or function to wrap.
 * @param errorsToCatch Optional array of Error classes to catch.
 */
export function fromPromise<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(promise: Promise<T>, errorsToCatch?: E[]): Promise<Result<T, InstanceType<E>>>
export function fromPromise<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(fn: () => T | Promise<T>, errorsToCatch?: E[]): Promise<Result<T, InstanceType<E>>>
export function fromPromise<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E>>> {
  return catchError(promiseOrFn as any, errorsToCatch)
}
