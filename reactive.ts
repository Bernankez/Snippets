const bucket: WeakMap<Object, Map<PropertyKey, Set<(...args) => any>>> = new WeakMap();
let activeEffect;
const activeStack = [];

function reactive(obj) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      const res = Reflect.set(target, prop, value, receiver);
      trigger(target, prop);
      return res;
    },
    get(target, prop, receiver) {
      track(target, prop);
      return Reflect.get(target, prop, receiver);
    },
  });
}

function effect(cb, options?: { scheduler? }) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    activeStack.push(effectFn);
    cb();
    activeStack.pop();
    activeEffect = activeStack[activeStack.length - 1];
  };
  effectFn.options = options;
  effectFn.deps = [];
  effectFn();
}

function cleanup(effect) {
  for (let i = 0; i < effect.deps.length; i++) {
    effect.deps[i].delete(effect);
  }
  effect.length = 0;
}

function trigger(obj, prop) {
  const objMap = bucket.get(obj);
  if (!objMap) return;
  const propEffects = objMap.get(prop);
  const effectsToRun: Set<{ (...args): any; options? }> = new Set();
  propEffects &&
    propEffects.forEach(eff => {
      if (activeEffect !== eff) {
        effectsToRun.add(eff);
      }
    });
  effectsToRun.forEach(eff => {
    if (eff.options && eff.options.scheduler) {
      eff.options.scheduler(eff);
    } else {
      eff();
    }
  });
}

function track(obj, prop) {
  if (!activeEffect) return;
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

function createScheduler() {
  const queue: Set<{ (...args): any; options?: { scheduler? } }> = new Set();
  const task = Promise.resolve();
  let isFlushing = false;

  return function (fn) {
    queue.add(fn);
    if (isFlushing) return;
    isFlushing = true;
    task
      .then(() => {
        queue.forEach(fun => fun());
      })
      .finally(() => {
        isFlushing = false;
      });
  };
}

const a = reactive({ a: 1, b: 2 });
effect(
  () => {
    console.log(a.a); // 1,6,7
  },
  {
    scheduler: createScheduler(),
  }
);
a.a = 4;
a.a = 5;
a.a = 6;
setTimeout(() => {
  a.a = 7;
}, 100);
