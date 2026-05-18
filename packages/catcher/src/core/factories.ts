import { Result, ResultFailure, ResultMethods, ResultSuccess } from './types'

/**
 * Creates a successful Result that contains the provided value.
 *
 * @param data - The success value to store in the Result.
 * @returns A Result representing success that contains `data`.
 */
export function ok<T>(data: T): Result<T, never> {
  return makeResult<T, never>(undefined, data, OK_SYMBOL)
}

/**
 * Create a failed Result that encapsulates the provided error.
 *
 * @param error - The failure value to store in the Result
 * @returns A `Result` in the error state containing `error`
 */
export function err<E>(error: E): Result<never, E> {
  return makeResult(error, undefined, 'err') as any
}

const OK_SYMBOL = Symbol('ok')

/**
 * Internal factory to create the Result object.
 * Implements the hybrid Object/Tuple structure.
 */
export function makeResult<T, E>(error: E, data: undefined, status: typeof OK_SYMBOL | 'err'): ResultFailure<T, E>
export function makeResult<T, E>(error: undefined, data: T, status: typeof OK_SYMBOL): ResultSuccess<T, E>
/**
 * Create a Result value representing either success or failure.
 *
 * The returned value is an array-like Result<T, E> with numeric indices [error, data],
 * enumerables for `error` and `data`, and all standard Result methods attached
 * (isOk, isErr, unwrap, unwrapErr, getOrElse, map, mapErr, andThen/flatMap,
 * orElse, tap, tapErr, toPromise).
 *
 * @param error - The failure payload when creating an error Result; pass `undefined` for a success Result.
 * @param data - The success payload when creating a success Result; optional for error Results.
 * @param status - Discriminator that determines intended status: use `OK_SYMBOL` to permit a success Result or `'err'` to force an error Result. A Result is considered successful only when `status === OK_SYMBOL` and `error === undefined`.
 * @returns A Result<T, E> representing either success (containing `data`) or failure (containing `error`).
 */
export function makeResult<T, E>(error: E | undefined, data?: T, status: typeof OK_SYMBOL | 'err' = OK_SYMBOL): Result<T, E> {
  const isOkStatus = status === OK_SYMBOL && error === undefined

  const methods: ResultMethods<T, E> = {
    isOk(this: Result<T, E>): this is ResultSuccess<T, E> {
      return isOkStatus
    },
    isErr(this: Result<T, E>): this is ResultFailure<T, E> {
      return !isOkStatus
    },
    unwrap() {
      if (!isOkStatus) throw error
      return data as T
    },
    unwrapErr() {
      if (isOkStatus) throw data
      return error as E
    },
    getOrElse<D>(defaultValue: D): T | D {
      return !isOkStatus ? defaultValue : (data as T)
    },
    map<U>(fn: (data: T) => U): Result<U, E> {
      return !isOkStatus ? (this as any) : ok(fn(data as T))
    },
    mapErr<F>(fn: (error: E) => F): Result<T, F> {
      return isOkStatus ? (this as any) : err(fn(error as E))
    },
    andThen<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F> {
      return !isOkStatus ? (this as any) : fn(data as T)
    },
    flatMap<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F> {
      return this.andThen(fn)
    },
    orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F> {
      return isOkStatus ? (this as any) : fn(error as E)
    },
    tap(fn: (data: T) => void): Result<T, E> {
      if (isOkStatus) fn(data as T)
      return this as any
    },
    tapErr(fn: (error: E) => void): Result<T, E> {
      if (!isOkStatus) fn(error as E)
      return this as any
    },
    toPromise(): Promise<T> {
      return !isOkStatus ? Promise.reject(error) : Promise.resolve(data as T)
    },
  }

  const result = Object.assign([error, data], {
    error,
    data,
    0: error,
    1: data,
    ...methods,
    [Symbol.iterator]: function* () {
      yield error
      yield data
    },
  })

  Object.defineProperties(result, {
    error: { enumerable: false },
    data: { enumerable: false },
    isOk: { enumerable: false },
    isErr: { enumerable: false },
    unwrap: { enumerable: false },
    unwrapErr: { enumerable: false },
    getOrElse: { enumerable: false },
    map: { enumerable: false },
    mapErr: { enumerable: false },
    andThen: { enumerable: false },
    flatMap: { enumerable: false },
    orElse: { enumerable: false },
    tap: { enumerable: false },
    tapErr: { enumerable: false },
    toPromise: { enumerable: false },
  })

  return result as any
}
