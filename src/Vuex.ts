import Vue2 from "vue2";

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

export class Store<S> {
  private _state: any;
  public getters: any;
  private _mutations: any;
  private _actions: any;

  constructor(options: VuexOptions<S>) {
    if (!(this instanceof Store)) {
      throw new Error("Vuex Error: must be called with new operator");
    }
    if (options.getters) {
      this.getters = Object.create(null);
      Object.keys(options.getters).forEach(key => {
        Object.defineProperty(this.getters, key, {
          get: () => options.getters![key](this.state),
          enumerable: true,
        });
      });
    }
    this._mutations = Object.create(null);
    if (options.mutations) {
      Object.keys(options.mutations).forEach(key => {
        (this._mutations[key] = this._mutations[key] || []).push(options.mutations![key]);
      });
    }
    this._actions = options.actions || Object.create(null);
    this._state = Vue2.observable({
      state: options.state,
    });
    const _this = this;
    const { commit, disptach } = this;
    this.commit = function (type, payload) {
      return commit.call(this, type, payload, _this);
    };
    this.disptach = function (type, payload) {
      return disptach.call(this, type, payload, _this);
    };
  }

  get state() {
    return this._state.state;
  }

  commit(type, payload, store?) {
    if (type && (type.type ?? type.payload)) {
      payload = type.payload;
      type = type.type;
    }
    if (!store._mutations[type]) {
      return;
    }
    store._mutations[type].forEach(mutation => {
      mutation.call(store, store.state, payload);
    });
  }

  disptach(type, payload, store?) {
    if (type && (type.type ?? type.payload)) {
      payload = type.payload;
      type = type.type;
    }
    if (!store._actions[type]) {
      return;
    }
    store._actions[type].call(store, store, payload);
  }
}

export type VuexOptions<S> = {
  state: S;
  getters?: {
    [K: string]: (state: S) => any;
  };
  mutations?: {
    [K: string]: (state: S, payload: any) => any;
  };
  actions?: {
    [K: string]: (ctx: { commit }, payload: any) => any;
  };
};

export const store = new Store({
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
