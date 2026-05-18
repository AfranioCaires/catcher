import { describe, it, expect } from 'vitest'

import { catchError, catchErrorSync, catchErrorWithTimeout } from '../src/index'

class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}

describe('catchError (Async)', () => {
  it('should return data when promise resolves', async () => {
    const [error, data] = await catchError(Promise.resolve('success'))
    expect(error).toBeUndefined()
    expect(data).toBe('success')
  })

  it('should return error when promise rejects', async () => {
    const [error, data] = await catchError(Promise.reject(new Error('fail')))
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('fail')
    expect(data).toBeUndefined()
  })

  it('should catch only specific errors', async () => {
    const [error] = await catchError(Promise.reject(new CustomError('custom')), [CustomError])
    expect(error).toBeInstanceOf(CustomError)
  })

  it('should re-throw non-specified errors', async () => {
    const promise = Promise.reject(new Error('generic'))
    await expect(catchError(promise, [CustomError])).rejects.toThrow('generic')
  })

  it('should handle non-Error rejects', async () => {
    const [error] = await catchError(Promise.reject('string error'))
    expect(error).toBe('string error')
  })
})

describe('catchErrorSync', () => {
  it('should return data when function succeeds', () => {
    const [error, data] = catchErrorSync(() => 'success')
    expect(error).toBeUndefined()
    expect(data).toBe('success')
  })

  it('should return error when function throws', () => {
    const [error, data] = catchErrorSync(() => {
      throw new Error('sync fail')
    })
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('sync fail')
    expect(data).toBeUndefined()
  })

  it('should catch specific sync errors', () => {
    const [error] = catchErrorSync(() => {
      throw new CustomError('custom sync')
    }, [CustomError])
    expect(error).toBeInstanceOf(CustomError)
  })

  it('should re-throw non-specified sync errors', () => {
    const fn = () => {
      throw new Error('generic sync')
    }
    expect(() => catchErrorSync(fn, [CustomError])).toThrow('generic sync')
  })
})

describe('catchErrorWithTimeout', () => {
  it('should return data if promise resolves before timeout', async () => {
    const p = new Promise((resolve) => setTimeout(() => resolve('ok'), 10))
    const res = await catchErrorWithTimeout(p, 50)
    expect(res.isOk()).toBe(true)
    expect(res.data).toBe('ok')
  })

  it('should return error if promise times out', async () => {
    const p = new Promise((resolve) => setTimeout(() => resolve('ok'), 100))
    const res = await catchErrorWithTimeout(p, 10)
    expect(res.isErr()).toBe(true)
    expect(res.unwrapErr().message).toContain('timed out')
  })

  it('should catch specific error before timeout', async () => {
    const p = Promise.reject(new CustomError('custom'))
    const res = await catchErrorWithTimeout(p, 50, [CustomError])
    expect(res.isErr()).toBe(true)
    expect(res.unwrapErr()).toBeInstanceOf(CustomError)
  })

  it('should catch timeout error even when specific errorsToCatch are provided', async () => {
    const p = new Promise((resolve) => setTimeout(() => resolve('ok'), 100))
    const res = await catchErrorWithTimeout(p, 10, [CustomError])
    expect(res.isErr()).toBe(true)
    expect(res.unwrapErr().message).toContain('timed out')
  })

  it('should handle synchronous return values correctly and not bypass timeout logic', async () => {
    const res = await catchErrorWithTimeout(() => 'sync success', 100)
    expect(res.isOk()).toBe(true)
    expect(res.data).toBe('sync success')
  })

  it('should catch synchronous throws from the provided function', async () => {
    const res = await catchErrorWithTimeout(() => {
      throw new Error('sync throw')
    }, 100)
    expect(res.isErr()).toBe(true)
    expect(res.unwrapErr().message).toBe('sync throw')
  })

  it('should handle direct non-promise values correctly', async () => {
    const res = await catchErrorWithTimeout('direct value' as any, 100)
    expect(res.isOk()).toBe(true)
    expect(res.data).toBe('direct value')
  })
})
