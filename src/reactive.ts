const bucket: WeakMap<Object, Map<PropertyKey, Set<(...args) => any>>> = new WeakMap();
let activeEffect;
const activeStack: any[] = [];
const isReactiveObj = Symbol("isReactiveObj");

export function reactive(obj) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      const res = Reflect.set(target, prop, value, receiver);
      trigger(target, prop);
      return res;
    },
    get(target, prop, receiver) {
      if (prop === isReactiveObj) {
        return true;
      }
      track(target, prop);
      const rtn = Reflect.get(target, prop, receiver);
      if (rtn && typeof rtn === "object") {
        return reactive(rtn);
      }
      return rtn;
    },
  });
}

export function isReactive(obj) {
  return !!(obj && obj[isReactiveObj]);
}

function effect(cb, options?: { scheduler?; immediate? }) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    activeStack.push(effectFn);
    const rtn = cb();
    activeStack.pop();
    activeEffect = activeStack[activeStack.length - 1];
    return rtn;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (options && options.immediate) {
    return options.scheduler(effectFn);
  } else {
    return effectFn();
  }
}

function cleanup(effect) {
  for (let i = 0; i < effect.deps.length; i++) {
    effect.deps[i].delete(effect);
  }
  effect.deps.length = 0;
}

export function trigger(obj, prop) {
  const objMap = bucket.get(obj);
  if (!objMap) { return; }
  const propEffects = objMap.get(prop);
  const effectsToRun: Set<{ (...args): any; options?; lastValue? }> = new Set();
  propEffects
    && propEffects.forEach((eff) => {
      if (activeEffect !== eff) {
        effectsToRun.add(eff);
      }
    });
  effectsToRun.forEach((eff) => {
    if (eff.options && eff.options.scheduler) {
      eff.options.scheduler(eff);
    } else {
      eff();
    }
  });
}

function track(obj, prop) {
  if (!activeEffect) { return; }
  let objMap = bucket.get(obj);
  if (!objMap) {
    objMap = new Map();
    bucket.set(obj, objMap);
  }
  let propEffects = objMap.get(prop);
  if (!propEffects) {
    propEffects = new Set();
    objMap.set(prop, propEffects);
  }
  propEffects.add(activeEffect);
  activeEffect.deps.push(propEffects);
}

export function createScheduler(type: "lazy" | "nextTick") {
  const queue: Set<{ (...args): any; options?: { scheduler? } }> = new Set();
  const queuePostFlushCb: { (...args): any; options?: { scheduler? } }[] = [];
  const task = Promise.resolve();
  let isFlushing = false;
  let isFlushPending = false;

  function nextTick(cb: ((...args: any[]) => any) | ((...args: any[]) => any)[]) {
    if (Array.isArray(cb)) {
      queuePostFlushCb.push(...cb);
    } else {
      queuePostFlushCb.push(cb);
    }
  }

  function queueJob() {
    isFlushPending = false;
    isFlushing = true;

    task
      .then(() => {
        queue.forEach((job, jobSelf, set) => {
          job();
          set.delete(job);
        });
        queuePostFlushCb.forEach((cb, index, arr) => {
          cb();
          arr.shift();
        });

        if (queue.size > 0) {
          queueJob();
        }
      })
      .finally(() => {
        isFlushing = false;
        isFlushPending = false;
      });
  }

  switch (type) {
    case "lazy":
      return function (fn) {
        queue.add(fn);
        if (isFlushing) { return; }
        isFlushing = true;
        task
          .then(() => {
            queue.forEach(fun => fun());
          })
          .finally(() => {
            isFlushing = false;
          });
      };
    case "nextTick":
      return {
        scheduler(fn) {
          queue.add(fn);
          if (!isFlushPending || !isFlushing) {
            isFlushPending = true;
            queueJob();
          }
        },
        nextTick,
      };
  }
}

export function watch(dep: () => any, cb: (newValue, oldValue) => any, options?: { immediate? }) {
  effect(dep, {
    scheduler(fn) {
      const cur = fn();
      cb(cur, fn.lastValue);
      fn.lastValue = cur;
      return cur;
    },
    immediate: options?.immediate,
  });
}

export const watchEffect = effect;

export function computed(cb) {
  return {
    get value() {
      return effect(cb);
    },
  };
}
