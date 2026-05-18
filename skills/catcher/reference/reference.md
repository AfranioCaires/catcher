# API Reference - Catcher

## catchError

```ts
async function catchError<T, E extends ErrorClass>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E>>>;
```

## catchErrorWithTimeout

```ts
async function catchErrorWithTimeout<T, E extends ErrorClass>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  timeoutMs: number,
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E> | Error>>;
```

## catchErrorSync

```ts
function catchErrorSync<T, E extends ErrorClass>(
  fn: () => T,
  errorsToCatch?: E[],
): Result<T, InstanceType<E>>;
```

## catchErrorAll

```ts
type CatchErrorAllInput<T> =
  | Promise<T>
  | (() => T | Promise<T>)
  | readonly [Promise<T> | (() => T | Promise<T>)]
  | readonly [Promise<T> | (() => T | Promise<T>), ErrorClass[]]
  | readonly [Promise<T> | (() => T | Promise<T>), ErrorClass[], (error: any) => T | void]
  | {
      promise: Promise<T> | (() => T | Promise<T>);
      timeoutMs?: number;
      errorsToCatch?: ErrorClass[];
      handler?: (error: any) => T | void;
    };

function catchErrorAll<T extends readonly CatchErrorAllInput<any>[]>(
  inputs: [...T],
): Promise<{ [K in keyof T]: Result<InferInput<T[K]>, Error> }>;
```

## catchErrorAllSync

```ts
type CatchErrorAllSyncInput<T> =
  | (() => T)
  | readonly [() => T]
  | readonly [() => T, ErrorClass[]]
  | readonly [() => T, ErrorClass[], (error: any) => T | void]
  | { fn: () => T; errorsToCatch?: ErrorClass[]; handler?: (error: any) => T | void };

function catchErrorAllSync<T extends readonly CatchErrorAllSyncInput<any>[]>(
  inputs: [...T],
): { [K in keyof T]: Result<InferInputSync<T[K]>, Error> };
```

## combine

```ts
function combine<T extends readonly Result<any, any>[]>(
  results: [...T],
): Result<{ [K in keyof T]: UnwrapOk<T[K]> }, UnwrapErr<T[number]>>;
```

## combineAll

```ts
function combineAll<T extends readonly Result<any, any>[]>(
  results: [...T],
): Result<{ [K in keyof T]: UnwrapOk<T[K]> }, UnwrapErr<T[number]>[]>;
```

## partition

```ts
function partition<T, E>(results: Result<T, E>[]): { ok: T[]; err: E[] };
```

## fromNullable

```ts
function fromNullable<T, E>(value: T | null | undefined, error: E): Result<T, E>;
```

## fromThrowable

```ts
function fromThrowable<T, E extends ErrorClass, Args extends any[]>(
  fn: (...args: Args) => T,
  errorsToCatch?: E[],
): (...args: Args) => Result<T, InstanceType<E>>;
```

## fromPromise

```ts
async function fromPromise<T, E extends ErrorClass>(
  promiseOrFn: Promise<T> | (() => T | Promise<T>),
  errorsToCatch?: E[],
): Promise<Result<T, InstanceType<E>>>;
```

## ok / err

```ts
function ok<T>(data: T): Result<T, never>;
function err<E>(error: E): Result<never, E>;
```

## ResultMethods (methods on the Result object)

```ts
interface ResultMethods<T, E> {
  isOk(): this is ResultSuccess<T, E>;
  isErr(): this is ResultFailure<T, E>;
  unwrap(): T;
  unwrapErr(): E;
  getOrElse<D>(defaultValue: D): T | D;
  map<U>(fn: (data: T) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  andThen<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F>;
  flatMap<U, F>(fn: (data: T) => Result<U, F>): Result<U, E | F>;
  orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F>;
  tap(fn: (data: T) => void): Result<T, E>;
  tapErr(fn: (error: E) => void): Result<T, E>;
  toPromise(): Promise<T>;
}
```
