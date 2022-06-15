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
