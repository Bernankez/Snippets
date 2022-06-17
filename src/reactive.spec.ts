import { describe, it, expect, vi } from "vitest";
import { isReactive, reactive, watchEffect, watch, computed, createScheduler } from "./reactive";

const a = reactive({ a: 1, b: 2 });
const b = computed(() => a.b);

describe("reactive", () => {
  it("reactive", () => {
    expect(a).toHaveProperty(["a"]);
    expect(a).not.toHaveProperty("b");
    expect(a.a).toBe(1);
  });

  it("isReactive", () => {
    expect(isReactive(a)).toBe(true);
    expect(isReactive({ a: 1 })).toBe(false);
  });

  it("watchEffect", () => {
    const cbObj = { cb: () => console.log(a.a) };
    const spy = vi.spyOn(cbObj, "cb");
    watchEffect(cbObj.cb);
    a.a = 2;
    a.a = 3;
    a.a = 4;
    expect(spy).toHaveBeenCalledTimes(4);
    expect(a.a).toBe(4);
  });

  it("computed", () => {
    expect(b.value).toBe(2);
    a.b = 3;
    expect(b.value).toBe(3);
  });

  it.skip("watch computed", () => {
    const cbObj = {
      cb: newVal => {
        console.log(newVal);
      },
    };
    const spy = vi.spyOn(cbObj, "cb");
    watch(() => b.value, cbObj.cb);
    expect(spy).toHaveBeenCalledTimes(0);
    a.b = 10;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("watch reactive", () => {
    const cbObj = {
      cb: newVal => {
        console.log(newVal);
      },
    };
    const spy = vi.spyOn(cbObj, "cb");
    watch(() => a.b, cbObj.cb);
    expect(spy).toHaveBeenCalledTimes(0);
    a.b = 10;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("scheduler lazy", () => {
    const cbObj = {
      cb: () => {
        console.log(a.b);
      },
    };
    const spy = vi.spyOn(cbObj, "cb");
    watchEffect(cbObj.cb, {
      scheduler: createScheduler("lazy"),
    });
    a.b = 2;
    a.b = 3;
    a.b = 4;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(a.b).toBe(4);
  });

  it("scheduler nextTick", () => {
    const cbObj = {
      cb: () => {
        console.log(a.b);
      },
    };
    const spy = vi.spyOn(cbObj, "cb");
    const nextTickObj = {
      cb: () => {
        c = a.b;
      },
    };
    const spyNextTick = vi.spyOn(nextTickObj, "cb");
    let c;
    const { scheduler, nextTick } = createScheduler("nextTick") as any;
    nextTick(() => {
      nextTickObj.cb();
      expect(c).toBe(12);
      expect(spyNextTick).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(a.b).toBe(12);
    });
    watchEffect(cbObj.cb, {
      scheduler,
    });
    a.b = 10;
    a.b = 11;
    a.b = 12;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(a.b).toBe(12);
  });
});
