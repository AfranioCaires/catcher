import { err, ok } from '../core/factories'
import { Result } from '../core/types'

/**
 * Combines multiple Results into a single Result containing an array of data.
 * Returns the first error encountered if any Result is a failure.
 * @param results Array of Results to combine.
 */
export function combine<T extends readonly Result<any, any>[]>(
  results: [...T],
): Result<
  { [K in keyof T]: T[K] extends Result<infer U, any> ? U : never },
  T[number] extends Result<any, infer E> ? E : never
> {
  const data: any[] = []
  for (const result of results) {
    if (result.isErr()) return result as any
    data.push(result.data)
  }
  return ok(data) as any
}

/**
 * Combines multiple Results, collecting ALL errors if any occur.
 * If all succeed, returns an array of data.
 * @param results Array of Results to combine.
 */
export function combineAll<T extends readonly Result<any, any>[]>(
  results: [...T],
): Result<
  { [K in keyof T]: T[K] extends Result<infer U, any> ? U : never },
  (T[number] extends Result<any, infer E> ? E : never)[]
> {
  const data: any[] = []
  const errors: any[] = []
  for (const result of results) {
    if (result.isErr()) errors.push(result.error)
    else data.push(result.data)
  }
  return errors.length > 0 ? (err(errors) as any) : (ok(data) as any)
}

/**
 * Partitions an array of Results into two separate arrays: one for successes and one for failures.
 * @param results Array of Results to partition.
 */
export function partition<T, E>(results: Result<T, E>[]): { ok: T[]; err: E[] } {
  const oks: T[] = []
  const errs: E[] = []
  for (const result of results) {
    if (result.isOk()) oks.push(result.data)
    else errs.push(result.error)
  }
  return { ok: oks, err: errs }
}
