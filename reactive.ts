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

function effect(cb, scheduler?) {
  const effectFn = () => {
    activeEffect = effectFn;
    cb();
    activeEffect = null;
  };
  effectFn();
}

function trigger(obj, prop) {
  const curMap = bucket.get(obj);
  if (!curMap) return;
  const currentEffects = curMap.get(prop);
  currentEffects &&
    currentEffects.forEach(eff => {
      if (activeEffect !== eff) {
        eff();
      }
    });
}

function track(obj, prop) {
  if (!activeEffect) return;
  let eff = bucket.get(obj);
  if (!eff) {
    eff = new Map();
    bucket.set(obj, eff);
  }
  let propEff = eff.get(prop);
  if (!propEff) {
    propEff = new Set();
    eff.set(prop, propEff);
  }
  propEff.add(activeEffect);
}

const a = reactive({ a: 1, b: 2 });
effect(() => {
  console.log(a.a); // 1 4
  a.a = 4;
});
effect(() => {
  console.log(a.b); // 2 5
});
a.a = 4;
a.b = 5;
effect(() => {
  console.log(a.b); // 5
});
