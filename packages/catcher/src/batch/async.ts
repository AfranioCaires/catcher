import { catchError, catchErrorWithTimeout } from '../core/catchers'
import { ok } from '../core/factories'
import { Result } from '../core/types'

/** Allowed input types for batch catchErrorAll operations. */
export type CatchErrorAllInput<T> =
  | Promise<T>
  | (() => Promise<T>)
  | readonly [Promise<T> | (() => Promise<T>)]
  | readonly [Promise<T> | (() => Promise<T>), (new (...args: any[]) => Error)[]]
  | readonly [
      Promise<T> | (() => Promise<T>),
      (new (...args: any[]) => Error)[],
      (error: any) => T | void,
    ]
  | {
      promise: Promise<T> | (() => Promise<T>)
      timeoutMs?: number
      errorsToCatch?: (new (...args: any[]) => Error)[]
      handler?: (error: any) => T | void
    }

type InferInput<T> = T extends CatchErrorAllInput<infer R> ? R : never

/**
 * Runs multiple asynchronous operations concurrently and returns their Results.
 * Supports various input formats: raw Promises, tuples with options, or configuration objects.
 * @param inputs Array of Promises or configured inputs.
 */
export function catchErrorAll<T extends readonly CatchErrorAllInput<any>[]>(
  inputs: [...T],
): Promise<{
  [K in keyof T]: Result<InferInput<T[K]>, Error>
}>

/**
 * Execute multiple inputs concurrently and capture each outcome as a `Result`.
 *
 * Each input may be a `Promise`, a function that returns a `Promise`, a tuple, or a config object.
 * Tuples have the form `[promiseOrFn, errorsToCatch?, handler?]`. Config objects have `{ promise, timeoutMs?, errorsToCatch?, handler? }`.
 * If `timeoutMs` is provided for an input, that input is subject to a timeout. If `errorsToCatch` is provided, only instances of those error constructors are caught.
 * If an input's `handler` is provided and returns a non-`undefined` value when an error occurs, that value is used as a successful result for that input.
 *
 * @param inputs - Array of inputs to execute and capture; each element follows one of the supported input shapes described above.
 * @returns A tuple whose elements correspond to `inputs`; each element is a `Result` containing the input's fulfilled value or an `Error`.
 */
export function catchErrorAll<T extends readonly CatchErrorAllInput<any>[]>(inputs: [...T]) {
  return Promise.all(
    inputs.map(async (input) => {
      let promiseOrFn: Promise<any> | (() => Promise<any>)
      let timeoutMs: number | undefined
      let errorsToCatch: (new (...args: any[]) => Error)[] | undefined
      let handler: ((error: any) => any | void) | undefined

      if (input instanceof Promise || typeof input === 'function') {
        promiseOrFn = input as any
      } else if (Array.isArray(input)) {
        ;[promiseOrFn, errorsToCatch, handler] = input as any
      } else {
        ;({ promise: promiseOrFn, timeoutMs, errorsToCatch, handler } = input as any)
      }

      const result = await (timeoutMs !== undefined
        ? catchErrorWithTimeout(promiseOrFn as any, timeoutMs, errorsToCatch)
        : catchError(promiseOrFn as any, errorsToCatch))

      if (result.isErr() && handler) {
        const fallback = handler(result.error)
        if (fallback !== undefined) return ok(fallback)
      }

      return result
    }),
  ) as any
}
