/**
 * Result when the operation succeeds.
 */
export type ResultSuccess<T, E = never> = {
  readonly error: undefined
  readonly data: T
} & ResultMethods<T, E> & readonly [error: undefined, data: T]

/**
 * Result when the operation fails.
 */
export type ResultFailure<T, E> = {
  readonly error: E
  readonly data: undefined
} & ResultMethods<T, E> & readonly [error: E, data: undefined]

/** Methods available on the Result object. */
export interface ResultMethods<T, E> {
  /** Returns true if the result is a success. */
  isOk(): this is ResultSuccess<T, E>
  /** Returns true if the result is a failure. */
  isErr(): this is ResultFailure<T, E>
  /** Returns the data if success, or throws the error if failure. */
  unwrap(): T
  /** Returns the data if success, or a default value if failure. */
  getOrElse(defaultValue: T): T
}

/** Discriminated union narrowed by the presence of `error`. */
export type Result<T, E = any> = ResultSuccess<T, E> | ResultFailure<T, E>

/**
 * Internal helper to create a Result object/tuple.
 */
function makeResult<T, E>(error: E, data: undefined): ResultFailure<T, E>
function makeResult<T, E>(error: undefined, data: T): ResultSuccess<T, E>
function makeResult<T, E>(error: E | undefined, data?: T): Result<T, E> {
  const tuple = [error, data] as any

  const methods: ResultMethods<T, E> = {
    isOk(): this is ResultSuccess<T, E> { return error === undefined },
    isErr(): this is ResultFailure<T, E> { return error !== undefined },
    unwrap() {
      if (error !== undefined) throw error
      return data as T
    },
    getOrElse(defaultValue: T) {
      if (error !== undefined) return defaultValue
      return data as T
    }
  }

  // Add properties and methods as non-enumerable
  Object.defineProperties(tuple, {
    error: { value: error, enumerable: false },
    data: { value: data, enumerable: false },
    isOk: { value: methods.isOk, enumerable: false },
    isErr: { value: methods.isErr, enumerable: false },
    unwrap: { value: methods.unwrap, enumerable: false },
    getOrElse: { value: methods.getOrElse, enumerable: false },
  })

  return tuple as Result<T, E>
}

/**
 * Catches errors from a Promise and returns a Result.
 */
export async function catchError<
  T, 
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error
>(
  promise: Promise<T>,
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E> | any>> {
  try {
    const data = await promise
    return makeResult(undefined, data)
  } catch (error: any) {
    if (!errorsToCatch || errorsToCatch.length === 0 || errorsToCatch.some((cls) => error instanceof cls)) {
      return makeResult(error, undefined)
    }
    throw error
  }
}

/**
 * Catches errors from a synchronous function and returns a Result.
 */
export function catchErrorSync<
  T, 
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error
>(
  fn: () => T,
  errorsToCatch?: E[],
): Result<T, InstanceType<E> | any> {
  try {
    const data = fn()
    return makeResult(undefined, data)
  } catch (error: any) {
    if (!errorsToCatch || errorsToCatch.length === 0 || errorsToCatch.some((cls) => error instanceof cls)) {
      return makeResult(error, undefined)
    }
    throw error
  }
}
