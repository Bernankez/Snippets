const p = Promise.resolve();

export function initVueNextTick(Vue) {
  Vue.nextTick = function (cb?: Function) {
    return cb ? p.then(() => cb()) : p;
  };

  Vue.prototype.$nextTick = Vue.nextTick;
}
