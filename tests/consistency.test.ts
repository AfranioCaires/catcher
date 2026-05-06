import { describe, it, expect } from 'vitest'
import { catchError, catchErrorSync } from '../src/index'

class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}

describe('catchError (Async)', () => {
  it('should return [undefined, data] on success', async () => {
    const result = await catchError(Promise.resolve('success'))
    expect(result).toHaveLength(2)
    expect(result[0]).toBeUndefined()
    expect(result[1]).toBe('success')
  })

  it('should return [error, undefined] on failure', async () => {
    const error = new Error('fail')
    const result = await catchError(Promise.reject(error))
    expect(result).toHaveLength(2)
    expect(result[0]).toBe(error)
    expect(result[1]).toBeUndefined()
  })

  it('should handle non-Error throws', async () => {
    const result = await catchError(Promise.reject('string error'))
    expect(result[0]).toBe('string error')
    expect(result[1]).toBeUndefined()
  })
})

describe('catchErrorSync', () => {
  it('should return [undefined, data] on success', () => {
    const result = catchErrorSync(() => 42)
    expect(result).toHaveLength(2)
    expect(result[0]).toBeUndefined()
    expect(result[1]).toBe(42)
  })

  it('should return [error, undefined] on failure', () => {
    const error = new Error('sync fail')
    const result = catchErrorSync(() => { throw error })
    expect(result).toHaveLength(2)
    expect(result[0]).toBe(error)
    expect(result[1]).toBeUndefined()
  })

  it('should handle non-Error throws in sync', () => {
    const result = catchErrorSync(() => { throw { code: 500 } })
    expect(result[0]).toEqual({ code: 500 })
    expect(result[1]).toBeUndefined()
  })
})

describe('Tuple Consistency (Runtime)', () => {
  it('should always have length 2', async () => {
    const res1 = await catchError(Promise.resolve(1))
    const res2 = await catchError(Promise.reject(1))
    const res3 = catchErrorSync(() => 1)
    const res4 = catchErrorSync(() => { throw 1 })

    expect(res1).toHaveLength(2)
    expect(res2).toHaveLength(2)
    expect(res3).toHaveLength(2)
    expect(res4).toHaveLength(2)
  })

  it('should allow access via index even on failure', async () => {
    const [err, data] = await catchError(Promise.reject('fail'))
    expect(err).toBe('fail')
    expect(data).toBeUndefined()
  })
})
