import { describe, it, expect, vi } from "vitest";
import { ok, err } from "../src/index";

describe("Result ok/err creators", () => {
  it("ok() should create a success result", () => {
    const res = ok("success");
    expect(res.isOk()).toBe(true);
    expect(res.isErr()).toBe(false);
    expect(res.data).toBe("success");
    expect(res.error).toBeUndefined();
    expect(res[0]).toBeUndefined();
    expect(res[1]).toBe("success");
  });

  it("err() should create a failure result", () => {
    const error = new Error("fail");
    const res = err(error);
    expect(res.isOk()).toBe(false);
    expect(res.isErr()).toBe(true);
    expect(res.error).toBe(error);
    expect(res.data).toBeUndefined();
    expect(res[0]).toBe(error);
    expect(res[1]).toBeUndefined();
  });
});

describe("Result Methods", () => {
  it("unwrap() should return data on success", () => {
    expect(ok(10).unwrap()).toBe(10);
  });

  it("unwrap() should throw error on failure", () => {
    const error = new Error("fail");
    expect(() => err(error).unwrap()).toThrow(error);
  });

  it("getOrElse() should return data on success", () => {
    expect(ok(10).getOrElse(0)).toBe(10);
  });

  it("getOrElse() should return default value on failure", () => {
    expect(err("fail").getOrElse(0)).toBe(0);
  });

  it("getOrElse() should handle falsy data correctly", () => {
    expect(ok(0).getOrElse(42)).toBe(0);
    expect(ok("").getOrElse("default")).toBe("");
    expect(ok(false).getOrElse(true)).toBe(false);
  });

  it("map() should transform data on success", () => {
    const res = ok(10).map((n) => n * 2);
    expect(res.unwrap()).toBe(20);
  });

  it("map() should ignore failure", () => {
    const res = err("fail").map((n: number) => n * 2);
    expect(res.isErr()).toBe(true);
    expect(res.error).toBe("fail");
  });

  it("mapErr() should transform error on failure", () => {
    const res = err("fail").mapErr((e) => `mapped ${e}`);
    expect(res.error).toBe("mapped fail");
  });

  it("mapErr() should ignore success", () => {
    const res = ok("ok").mapErr((e) => `mapped ${e}`);
    expect(res.unwrap()).toBe("ok");
  });

  it("andThen() should chain results on success", () => {
    const res = ok(10).andThen((n) => ok(n * 2));
    expect(res.unwrap()).toBe(20);
  });

  it("andThen() should propagate error on success", () => {
    const res = ok(10).andThen(() => err("fail"));
    expect(res.isErr()).toBe(true);
    expect(res.error).toBe("fail");
  });

  it("andThen() should ignore failure", () => {
    const res = err("initial").andThen((n: number) => ok(n * 2));
    expect(res.error).toBe("initial");
  });

  it("flatMap() should be an alias for andThen()", () => {
    const res = ok(10).flatMap((n) => ok(n * 2));
    expect(res.unwrap()).toBe(20);
  });

  it("orElse() should recover on failure", () => {
    const res = err("fail").orElse(() => ok("recovered"));
    expect(res.isOk()).toBe(true);
    expect(res.unwrap()).toBe("recovered");
  });

  it("orElse() should ignore success", () => {
    const res = ok("ok").orElse(() => ok("recovered"));
    expect(res.unwrap()).toBe("ok");
  });

  it("tap() should execute side effect on success", () => {
    const fn = vi.fn();
    const res = ok("data").tap(fn);
    expect(fn).toHaveBeenCalledWith("data");
    expect(res.unwrap()).toBe("data");
  });

  it("tap() should ignore failure", () => {
    const fn = vi.fn();
    const res = err("fail").tap(fn);
    expect(fn).not.toHaveBeenCalled();
    expect(res.isErr()).toBe(true);
  });

  it("tapErr() should execute side effect on failure", () => {
    const fn = vi.fn();
    const res = err("fail").tapErr(fn);
    expect(fn).toHaveBeenCalledWith("fail");
    expect(res.isErr()).toBe(true);
  });

  it("tapErr() should ignore success", () => {
    const fn = vi.fn();
    const res = ok("ok").tapErr(fn);
    expect(fn).not.toHaveBeenCalled();
    expect(res.isOk()).toBe(true);
  });

  it("toPromise() should resolve on success", async () => {
    const val = await ok("ok").toPromise();
    expect(val).toBe("ok");
  });

  it("toPromise() should reject on failure", async () => {
    const error = new Error("fail");
    await expect(err(error).toPromise()).rejects.toThrow(error);
  });
});
