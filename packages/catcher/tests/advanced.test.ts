import { describe, it, expect } from 'vitest'
import { catchError, catchErrorWithTimeout } from '../src/index'

describe('Advanced Patterns', () => {
  it('handles throwing primitives', async () => {
    const cases = ['string', 123, true, null, BigInt(10)]
    for (const val of cases) {
      const [error] = await catchError(async () => { throw val })
      expect(error).toBe(val)
    }
  })

  it('discriminates between same value success and failure', async () => {
    const value = 'same'
    const successRes = await catchError(async () => value)
    const failureRes = await catchError(async () => { throw value })

    expect(successRes.isOk()).toBe(true)
    expect(successRes.data).toBe(value)
    
    expect(failureRes.isErr()).toBe(true)
    expect(failureRes.error).toBe(value)
  })

  it('handles circular references', async () => {
    const circular = { message: 'circular', self: null as any }
    circular.self = circular
    
    const [error] = await catchError(async () => { throw circular })
    expect(error).toBe(circular)
    expect((error as unknown as typeof circular).self).toBe(circular)
  })

  it('handles late rejections after timeout', async () => {
    let rejectedAfter = false
    const promise = new Promise((_, reject) => {
      setTimeout(() => {
        rejectedAfter = true
        reject(new Error('late rejection'))
      }, 50)
    })

    const res = await catchErrorWithTimeout(promise as Promise<unknown>, 10)
    expect(res.isErr()).toBe(true)
    expect(res.unwrapErr().message).toContain('timed out')
    
    await new Promise(r => { setTimeout(r, 60) })
    expect(rejectedAfter).toBe(true)
  })

  it('handles stack overflow rejections', async () => {
    const overflow = () => {
      const recurse = (): unknown => recurse()
      return recurse()
    }

    const [error] = await catchError(async () => overflow())
    expect(error).toBeInstanceOf(RangeError)
    expect((error as unknown as RangeError).name).toBe('RangeError')
  })

  it('handles objects that resolve as strings', async () => {
    const promise = Promise.resolve({
      toString: () => 'result'
    })
    const { data } = await catchError(promise)
    expect(data?.toString()).toBe('result')
  })
})
