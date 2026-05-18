import { describe, it, expect } from 'vitest'
import { catchError } from '../src/index'

class CustomError extends Error {
  response?: { status: number };
  constructor(message: string, status?: number) {
    super(message);
    if (status) this.response = { status };
  }
}

async function fetchSuccess() {
  return { status: 200, data: 'ok' };
}

async function fetchFailure() {
  throw new CustomError('Not Found', 404);
}

describe('Type Narrowing & Edge Cases', () => {
  it('handles promise object destructuring', async () => {
    const { data, error } = await catchError(fetchSuccess(), [CustomError]);
    expect(error).toBeUndefined();
    expect(data?.status).toBe(200);
  });

  it('handles function object destructuring', async () => {
    const { data, error } = await catchError(fetchSuccess, [CustomError]);
    expect(error).toBeUndefined();
    expect(data?.status).toBe(200);
  });

  it('handles tuple destructuring success', async () => {
    const [error, data] = await catchError(fetchSuccess());
    expect(error).toBeUndefined();
    expect(data?.status).toBe(200);
  });

  it('handles tuple destructuring error', async () => {
    const [error, data] = await catchError(fetchFailure(), [CustomError]);
    expect(error).toBeInstanceOf(CustomError);
    expect(data).toBeUndefined();
    expect(error?.response?.status).toBe(404);
  });

  it('handles undefined throw', async () => {
    const [error, data] = await catchError(async () => { throw undefined });
    expect(error).toBeUndefined();
    expect(data).toBeUndefined();
    
    const res = await catchError(async () => { throw undefined });
    expect(res.isErr()).toBe(true);
    expect(res.unwrapErr()).toBeUndefined();
  });

  it('handles generic errors correctly', async () => {
     const [error] = await catchError(fetchFailure, [CustomError]);
     expect(error).toBeInstanceOf(CustomError);
     expect(error?.response?.status).toBe(404);
  });
});
