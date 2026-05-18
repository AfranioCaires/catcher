import { catchErrorSync } from '../core/catchers'
import { ok } from '../core/factories'
import { Result } from '../core/types'

/** Allowed input types for batch catchErrorAllSync operations. */
export type CatchErrorAllSyncInput<T> =
  | (() => T)
  | readonly [() => T]
  | readonly [() => T, (new (...args: any[]) => Error)[]]
  | readonly [() => T, (new (...args: any[]) => Error)[], (error: any) => T | void]
  | {
      fn: () => T
      errorsToCatch?: (new (...args: any[]) => Error)[]
      handler?: (error: any) => T | void
    }

type InferInputSync<T> = T extends CatchErrorAllSyncInput<infer R> ? R : never

/**
 * Runs multiple synchronous operations and returns their Results.
 * @param inputs Array of functions or configured inputs.
 */
export function catchErrorAllSync<T extends readonly CatchErrorAllSyncInput<any>[]>(
  inputs: [...T],
): {
  [K in keyof T]: Result<InferInputSync<T[K]>, Error>
}

/**
 * Execute multiple synchronous callables (or callable descriptors) and collect their results.
 *
 * For each entry in `inputs` the callable is invoked and its outcome is returned as a `Result`:
 * - On success the `Result` contains the callable's return value.
 * - On thrown `Error` the `Result` contains that error; if a handler is provided and returns a value other than `undefined`,
 *   that value is used as a successful fallback instead of the error.
 *
 * @param inputs - An array/tuple of callable inputs. Each element may be provided as:
 *   - a function `() => R`,
 *   - a tuple `[() => R, errorsToCatch? , handler?]` where `errorsToCatch` is an array of `Error` constructors to catch and `handler` is `(error) => R | void`,
 *   - or an object `{ fn: () => R, errorsToCatch?: ErrorConstructor[], handler?: (error) => R | void }`.
 * @returns A tuple with the same shape as `inputs` where each element is `Result<R, Error>`: the callable's return value on success or the thrown `Error` on failure (subject to handler fallbacks).
 */
export function catchErrorAllSync<T extends readonly CatchErrorAllSyncInput<any>[]>(
  inputs: [...T],
) {
  return inputs.map((input) => {
    let fn: () => any
    let errorsToCatch: (new (...args: any[]) => Error)[] | undefined
    let handler: ((error: any) => any | void) | undefined

    if (typeof input === 'function') {
      fn = input
    } else if (Array.isArray(input)) {
      ;[fn, errorsToCatch, handler] = input as any
    } else {
      ;({ fn, errorsToCatch, handler } = input as any)
    }

    const result = catchErrorSync(fn, errorsToCatch)

    if (result.isErr() && handler) {
      const fallback = handler(result.error)
      if (fallback !== undefined) return ok(fallback)
    }

    return result
  }) as any
}
