import { err, ok } from './factories'
import { Result } from './types'

/**
 * Executes a Promise and wraps its outcome in a Result.
 * @param promise The Promise to execute.
 * @param errorsToCatch Optional array of Error classes to catch.
 */
export async function catchError<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(promise: Promise<T>, errorsToCatch?: E[]): Promise<Result<T, InstanceType<E>>> {
  try {
    const data = await promise
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
 * Executes a Promise with a timeout and wraps its outcome in a Result.
 * @param promise The Promise to execute.
 * @param timeoutMs Timeout in milliseconds.
 * @param errorsToCatch Optional array of Error classes to catch.
 */
export async function catchErrorWithTimeout<
  T,
  E extends new (...args: any[]) => Error = new (...args: any[]) => Error,
>(
  promise: Promise<T>,
  timeoutMs: number,
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E> | Error>> {
  let timeoutId: any
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await catchError(Promise.race([promise, timeoutPromise]), errorsToCatch)
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
