import { reactive } from "./reactive";

let Vue;

export default function install(_Vue) {
  if (Vue) {
    console.warn("Vuex is already installed. Vuex.install() should only be called once.");
    return;
  }

  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store;
      } else {
        this.$store = this.$parent && this.$parent.$store;
      }
    },
  });
}

export class Vuex<S> {
  #state: S;
  #getters: any;
  #mutations: any;
  #actions: any;

  constructor(options: {
    state: S;
    getters?: { [k: string]: (state: S) => any };
    mutations: { [k: string]: (state, payload: any) => any };
    actions?: { [k: string]: ({ commit }, payload: any) => any };
  }) {
    this.#state = options.state;
    this.#getters = options.getters || {};
    this.#mutations = options.mutations || {};
    this.#actions = options.actions || {};

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  get state() {
    return this.#state;
  }

  get getters() {
    const _this = this;
    return new Proxy(this.#getters, {
      get(target, key, receiver) {
        return target[key].call(this, _this.#state);
      },
    });
  }

  commit(type: string, payload: any);
  commit(Obj: { type: string; payload: any });
  commit(options, payload?) {
    let _type = options;
    let _payload = payload;
    if (typeof options === "object") {
      _type = options.type;
      _payload = options.payload;
    }
    this.#mutations[_type](this.#state, _payload);
  }

  dispatch(type: string, payload: any) {
    let _type = type;
    let _payload = payload;
    this.#actions[_type](this, _payload);
  }
}

export const store = new Vuex({
  state: {
    a: 1,
    b: {
      c: 2,
    },
  },
  getters: {
    c: state => state.b.c,
  },
  mutations: {
    setA(state, a) {
      state.a = a;
    },
    setB(state, b) {
      state.b = b;
    },
    setC(state, c) {
      state.b.c = c;
    },
  },
  actions: {
    setA({ commit }, a) {
      commit({
        type: "setA",
        payload: a,
      });
    },
    setC({ commit }, c) {
      commit("setC", c);
    },
  },
});
