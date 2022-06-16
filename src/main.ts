import "./style.css";
import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js";
import Vuex, { store } from "./Vuex";
import { initVueUse } from "./interviews/vue-use";
import { BinaryHeap } from "./binary-heap";

initVueUse(Vue);
Vue.use(Vuex);

const vm = new Vue({
  store,
  render: h => h("div", store.getters.c),
}).$mount("#app");

console.log(vm.$store);

const b = new BinaryHeap((a, b) => a > b, [0, 4, 10, 5, 3]);
console.log(b.heap);
