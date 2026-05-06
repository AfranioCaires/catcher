import { describe, it, expect } from 'vitest'
import { catchError, catchErrorSync } from '../src/index'

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

  it('should work with Promise.all', async () => {
    const promises = [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3)
    ]
    const [error, data] = await catchError(Promise.all(promises))
    
    expect(error).toBeUndefined()
    expect(data).toEqual([1, 2, 3])
  })

  it('should catch error from Promise.all when one fails', async () => {
    const promises = [
      Promise.resolve(1),
      Promise.reject(new Error('failure')),
      Promise.resolve(3)
    ]
    const [error, data] = await catchError(Promise.all(promises))
    
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('failure')
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

  it('should handle JSON.parse as a common use case', () => {
    const validJson = '{"a": 1}'
    const invalidJson = '{"a": 1'
    
    const [err1, data1] = catchErrorSync(() => JSON.parse(validJson))
    expect(err1).toBeUndefined()
    expect(data1).toEqual({ a: 1 })

    const [err2, data2] = catchErrorSync(() => JSON.parse(invalidJson))
    expect(err2).toBeInstanceOf(SyntaxError)
    expect(data2).toBeUndefined()
  })
})

describe('Production Readiness & Types', () => {
  it('should support object destructuring on results', async () => {
    const { error, data } = await catchError(Promise.resolve('ok'))
    expect(error).toBeUndefined()
    expect(data).toBe('ok')
  })

  it('should have non-enumerable properties to not pollute JSON.stringify', async () => {
    const result = await catchError(Promise.resolve({ id: 1 }))
    const json = JSON.stringify(result)
    // The result is treated as a tuple [undefined, {id: 1}] in JSON.stringify
    // because error and data are non-enumerable.
    expect(json).toBe('[null,{"id":1}]')
  })
})
