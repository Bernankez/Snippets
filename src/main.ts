import "./style.css";
// @ts-ignore
// import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js";
import { PromiseLike, adapter } from "@/interviews/promise-like";

function test(value) {
  debugger
  return new PromiseLike((resolve, reject) => resolve(value));
}

function testInner(value) {
  return {
    then: function (onFulfilled) {
      debugger;
      setTimeout(function () {
        onFulfilled(value);
      }, 0);
    },
  };
}

function xFactory() {
  return {
    then: function (resolvePromise) {
      resolvePromise(yFactory());
    },
  };
}

function yFactory() {
  debugger;
  return test(testInner({ a: 1 }));
}

const { promise, resolve, reject } = adapter.deferred();
resolve();
const step = promise.then(() => {
  return xFactory();
});
debugger;
console.log(
  step.then(res => {
    console.log(res);
  })
);
// console.log(
//   new PromiseLike((resolve, reject) => {
//     resolve({ a: 1 });
//   })
// );
