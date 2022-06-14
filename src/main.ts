import "./style.css";
import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js";
import Vuex, { store } from "./Vuex";

Vue.use(Vuex);

// const a = Vue.observable({
//   a: 1,
// });

const vm = new Vue({
  store,
  render: h => h("div", store.getters.c),
}).$mount("#app");

console.log(vm.$store.state);
console.log(vm.$store.getters.c);
vm.$store.dispatch("setA", 3);
vm.$store.commit("setC", 5);
console.log(vm.$store.getters.c);
console.log(vm.$store.state);
// a.a = 2;
