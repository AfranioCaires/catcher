import { describe, it, expect } from 'vitest'
import { catchError, catchErrorAll } from '../src/index'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

class ValidationError extends Error {
  constructor(public fields: string[]) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}

const api = {
  async getUser(id: number) {
    if (id === 404) throw new ApiError(404, 'User not found')
    if (id === 500) throw new Error('Internal Server Error')
    return { id, name: 'John Doe', role: 'user' }
  },
  
  async getPermissions(role: string) {
    if (role === 'guest') throw new ApiError(403, 'Forbidden')
    return ['read', 'write']
  }
}

describe('E2E Scenarios', () => {
  it('Scenario 1: Fetching a user and handling domain errors', async () => {
    const [err1, user] = await catchError(api.getUser(1))
    expect(err1).toBeUndefined()
    expect(user?.name).toBe('John Doe')

    const [err2, data2] = await catchError(api.getUser(404), [ApiError])
    expect(err2).toBeInstanceOf(ApiError)
    expect(err2?.status).toBe(404)
    expect(data2).toBeUndefined()

    const [err3] = await catchError(api.getUser(500))
    expect(err3?.message).toBe('Internal Server Error')
  })

  it('Scenario 2: Chaining operations with result methods', async () => {
    const userRes = await catchError(api.getUser(1))
    
    if (userRes.isErr()) {
      throw new Error('Should not fail')
    }

    const permsRes = await catchError(api.getPermissions(userRes.data.role))
    
    expect(permsRes.isOk()).toBe(true)
    expect(permsRes.data).toContain('read')
  })

  it('Scenario 3: Implementing a simple retry mechanism', async () => {
    let attempts = 0
    const flakyTask = async () => {
      attempts++
      if (attempts < 3) throw new Error('Temp failure')
      return 'success'
    }

    let result
    for (let i = 0; i < 5; i++) {
      result = await catchError(flakyTask)
      if (result.isOk()) break
    }

    expect(result?.isOk()).toBe(true)
    expect(attempts).toBe(3)
    expect(result?.data).toBe('success')
  })

  it('Scenario 4: Batch processing with mixed results', async () => {
    const ids = [1, 404, 2]
    
    const results = await catchErrorAll(
      ids.map(id => ({
        promise: api.getUser(id),
        errorsToCatch: [ApiError],
        handler: (err) => {
          if (err instanceof ApiError && err.status === 404) {
            return { id: 0, name: 'Anonymous', role: 'guest' }
          }
        }
      }))
    )

    expect(results[0].data?.id).toBe(1)
    expect(results[1].data?.name).toBe('Anonymous')
    expect(results[2].data?.id).toBe(2)
  })

  it('Scenario 5: Functional validation pipe', async () => {
    const validate = (data: any) => {
      if (!data.email) throw new ValidationError(['email'])
      return { ...data, validated: true }
    }

    const input = { name: 'Test' }
    
    const result = await catchError(async () => validate(input), [ValidationError])
    
    expect(result.isErr()).toBe(true)
    const error = result.unwrapErr()
    expect(error).toBeInstanceOf(ValidationError)
    expect((error as ValidationError).fields).toContain('email')
  })
})
