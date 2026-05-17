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
  [K in keyof T]: Result<InferInput<T[K]>, any>
}>

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
        ? catchErrorWithTimeout(promiseOrFn, timeoutMs, errorsToCatch)
        : catchError(promiseOrFn, errorsToCatch))

      if (result.isErr() && handler) {
        const fallback = handler(result.error)
        if (fallback !== undefined) return ok(fallback)
      }

      return result
    }),
  ) as any
}
