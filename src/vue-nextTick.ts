import { createScheduler } from "../reactive";

const p = Promise.resolve();

export function initVueNextTick(Vue) {
  Vue.nextTick = function (cb?: () => void) {
    return cb ? p.then(cb) : p;
  };

  Vue.prototype.$nextTick = Vue.nextTick;
}

// export function initVueNextTick(Vue) {
//   Vue.nextTick = (createScheduler("nextTick") as any).nextTick;

//   Vue.prototype.$nextTick = Vue.nextTick;
// }
