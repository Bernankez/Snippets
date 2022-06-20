import "./style.css";
// @ts-ignore
import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js";
import Vuex, { store } from "./Vuex";
import { initVueUse } from "./interviews/vue-use";

initVueUse(Vue);
Vue.use(Vuex);

const vm = new Vue({
  store,
  render: function (h) {
    return h(
      "pre",
      {
        attrs: {
          id: "test",
        },
        ref: "test",
      },
      [JSON.stringify(this.$store.state), this.$store.getters.c]
    );
  },
}).$mount("#app");

console.log(vm.$store);
console.log(vm.$store.getters.c);
vm.$store.disptach("setC", 4);
console.log(vm.$store.getters.c);
