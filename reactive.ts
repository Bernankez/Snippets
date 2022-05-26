const bucket: WeakMap<Object, Map<PropertyKey, Set<(...args) => any>>> = new WeakMap();
let activeEffect;

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
    cb();
    activeEffect = null;
  };
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
  const effectsToRun: Set<(...args) => any> = new Set();
  propEffects &&
    propEffects.forEach(eff => {
      if (activeEffect !== eff) {
        effectsToRun.add(eff);
      }
    });
  effectsToRun.forEach(eff => eff());
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

const a = reactive({ a: 1, b: 2 });
effect(() => {
  console.log(a.a);
});
// effect(() => {
//   console.log(a.b);
// });
a.a = 4;
a.a = 5;
a.a = 6;
// a.b = 3;
// a.b = 5;
// effect(() => {
//   console.log(a.b);
// });
