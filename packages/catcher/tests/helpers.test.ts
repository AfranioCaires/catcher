import { describe, it, expect } from "vitest";
import {
  fromNullable,
  fromThrowable,
  fromPromise,
  combine,
  combineAll,
  partition,
  ok,
  err,
} from "../src/index";

describe("Helper Utilities", () => {
  it("fromNullable() should handle null/undefined", () => {
    expect(fromNullable("data", "error").isOk()).toBe(true);
    expect(fromNullable(null, "error").error).toBe("error");
    expect(fromNullable(undefined, "error").error).toBe("error");
  });

  it("fromThrowable() should wrap a throwing function", () => {
    const safe = fromThrowable((n: number) => {
      if (n < 0) throw new Error("negative");
      return n * 2;
    });
    expect(safe(5).unwrap()).toBe(10);
    expect(safe(-1).isErr()).toBe(true);
  });

  it("fromPromise() should wrap a promise", async () => {
    const res = await fromPromise(Promise.resolve("ok"));
    expect(res.isOk()).toBe(true);
    expect(res.unwrap()).toBe("ok");

    const resErr = await fromPromise(Promise.reject("fail"));
    expect(resErr.isErr()).toBe(true);
    expect(resErr.error).toBe("fail");
  });

  it("combine() should merge successful results or return first error", () => {
    const success = combine([ok(1), ok(2)]);
    expect(success.unwrap()).toEqual([1, 2]);

    const failure = combine([ok(1), err("e1"), err("e2")]);
    expect(failure.isErr()).toBe(true);
    expect(failure.error).toBe("e1");
  });

  it("combineAll() should collect all errors", () => {
    const success = combineAll([ok(1), ok(2)]);
    expect(success.unwrap()).toEqual([1, 2]);

    const failure = combineAll([ok(1), err("e1"), ok(2), err("e2")]);
    expect(failure.isErr()).toBe(true);
    expect(failure.error).toEqual(["e1", "e2"]);
  });

  it("partition() should split results into ok and err arrays", () => {
    const results = [ok(1), err("e1"), ok(2), err("e2")];
    const { ok: okData, err: errData } = partition(results);
    expect(okData).toEqual([1, 2]);
    expect(errData).toEqual(["e1", "e2"]);
  });
});
