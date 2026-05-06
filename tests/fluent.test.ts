import { describe, it, expect } from 'vitest'
import { catchError, catchErrorSync } from '../src/index'

describe('Fluent API', () => {
  it('should support isOk and isErr', async () => {
    const success = await catchError(Promise.resolve('ok'))
    const failure = await catchError(Promise.reject('fail'))

    expect(success.isOk()).toBe(true)
    expect(success.isErr()).toBe(false)
    expect(failure.isOk()).toBe(false)
    expect(failure.isErr()).toBe(true)
  })

  it('should support unwrap', async () => {
    const success = await catchError(Promise.resolve('data'))
    expect(success.unwrap()).toBe('data')

    const failure = await catchError(Promise.reject(new Error('boom')))
    expect(() => failure.unwrap()).toThrow('boom')
  })

  it('should support getOrElse', async () => {
    const success = await catchError<number>(Promise.resolve(10))
    expect(success.getOrElse(0)).toBe(10)

    const failure = await catchError<number>(Promise.reject('error'))
    expect(failure.getOrElse(0)).toBe(0)
  })
})
