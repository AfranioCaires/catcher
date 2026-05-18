import { describe, it, expect, vi } from 'vitest'

import { catchErrorAll, catchErrorAllSync } from '../src/index'

describe('catchErrorAll (Async Batch)', () => {
  it('should run multiple promises and return results', async () => {
    const p1 = Promise.resolve('data1')
    const p2 = Promise.resolve('data2')
    const [r1, r2] = await catchErrorAll([p1, p2])

    expect(r1.unwrap()).toBe('data1')
    expect(r2.unwrap()).toBe('data2')
  })

  it('should handle failures', async () => {
    const error = new Error('fail')
    const p1 = Promise.resolve('data1')
    const p2 = Promise.reject(error)
    const [r1, r2] = await catchErrorAll([p1, p2])

    expect(r1.isOk()).toBe(true)
    expect(r2.isErr()).toBe(true)
    expect(r2.error).toBe(error)
  })

  it('should support specific errors and handlers', async () => {
    const error = new Error('fail')
    const p1 = Promise.reject(error)
    const handler = vi.fn(() => 'fallback')

    const [r1] = await catchErrorAll([
      {
        promise: p1,
        handler,
      },
    ])

    expect(r1.isOk()).toBe(true)
    expect(r1.data).toBe('fallback')
    expect(handler).toHaveBeenCalledWith(error)
  })

  it('should support timeout in catchErrorAll', async () => {
    const p1 = new Promise((resolve) => setTimeout(() => resolve('slow'), 50))
    const [r1] = await catchErrorAll([
      {
        promise: p1,
        timeoutMs: 10,
      },
    ])
    expect(r1.isErr()).toBe(true)
    expect(r1.error?.message).toContain('timed out')
  })

  it('should support tuple syntax', async () => {
    const p1 = Promise.resolve('ok')
    const [r1] = await catchErrorAll([[p1]])
    expect(r1.unwrap()).toBe('ok')
  })

  it('should support full tuple syntax with errors and handler', async () => {
    const error = new Error('fail')
    const p1 = Promise.reject(error)
    const handler = (e: any) => `handled ${e.message}`
    const [r1] = await catchErrorAll([[p1, [Error], handler]])
    expect(r1.unwrap()).toBe('handled fail')
  })

  it('should not return fallback if handler returns undefined', async () => {
    const error = new Error('fail')
    const p1 = Promise.reject(error)
    const [r1] = await catchErrorAll([
      {
        promise: p1,
        handler: () => {},
      },
    ])
    expect(r1.isErr()).toBe(true)
    expect(r1.error).toBe(error)
  })
})

describe('catchErrorAllSync (Sync Batch)', () => {
  it('should run multiple functions and return results', () => {
    const [r1, r2] = catchErrorAllSync([() => 'data1', () => 'data2'])
    expect(r1.unwrap()).toBe('data1')
    expect(r2.unwrap()).toBe('data2')
  })

  it('should handle failures with handlers', () => {
    const error = new Error('fail')
    const [r1] = catchErrorAllSync([
      {
        fn: () => {
          throw error
        },
        handler: () => 'fallback',
      },
    ])
    expect(r1.unwrap()).toBe('fallback')
  })

  it('should support tuple syntax', () => {
    const fn = () => 'ok'
    const [r1] = catchErrorAllSync([fn])
    expect(r1.unwrap()).toBe('ok')
  })

  it('should support full tuple syntax with errors and handler', () => {
    const error = new Error('fail')
    const fn = () => {
      throw error
    }
    const handler = (e: any) => `handled ${e.message}`
    const [r1] = catchErrorAllSync([[fn, [Error], handler]])
    expect(r1.unwrap()).toBe('handled fail')
  })

  it('should not return fallback if handler returns undefined', () => {
    const error = new Error('fail')
    const [r1] = catchErrorAllSync([
      {
        fn: () => {
          throw error
        },
        handler: () => {},
      },
    ])
    expect(r1.isErr()).toBe(true)
    expect(r1.error).toBe(error)
  })
})
