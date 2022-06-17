import "./style.css";
import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js";
import Vuex, { store } from "./Vuex";
import { initVueUse } from "./interviews/vue-use";
import { initVueNextTick } from "./interviews/vue-nextTick";

initVueUse(Vue);
initVueNextTick(Vue);
Vue.use(Vuex);

const vm = new Vue({
  store,
  render: h =>
    h(
      "div",
      {
        attrs: {
          id: "test",
        },
        ref: "test",
      },
      store.getters.c
    ),
  data: {
    a: 1,
  },
  created() {
    const div = this.$refs.test;
    console.dir("refs", this.$refs);
    console.log("div", div);
    this.$nextTick(() => {
      const div = document.querySelector("#test");
      console.log("nextTick", div);
      console.log("nextTick innterHTML", div?.innerHTML);
    });
    this.$nextTick().then(() => {
      const div = document.querySelector("#test");
      console.log("nextTick", div);
      console.log("nextTick innterHTML", div?.innerHTML);
    });
  },
}).$mount("#app");

console.log(vm.$store);
