import { describe, it, expect } from "vitest";
import { Store } from "./Vuex";

const obj = {
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
};
const store = new Store(obj);

describe("Vuex", () => {
  it("state", () => {
    expect(store.state).toStrictEqual(obj.state);
  });

  it("getters", () => {
    expect(store.getters.c).toBe(2);
  });

  it("commit", () => {
    store.commit("setA", 10);
    expect(store.state.a).toBe(10);
  });

  it("dispatch", () => {
    store.commit("setC", 20);
    expect(store.getters.c).toBe(20);
  });
});
