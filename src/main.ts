import "./style.css";
// @ts-ignore
// import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js";
import { PromiseLike } from "@/interviews/promise-like";

const app = document.querySelector("#app");
console.log(app);
const fragment = document.createDocumentFragment();
const button1 = document.createElement("button");
const button2 = document.createElement("button");
fragment.appendChild(button1);
fragment.appendChild(button2);
app?.appendChild(fragment);
button1.innerText = "PromiseLike";
button1.addEventListener("click", promiselike);
button2.innerText = "Promise";
button2.addEventListener("click", promise);

function promiselike() {
  console.clear();
  new PromiseLike((resolve, reject) => {
    resolve();
  })
    .then(() => {
      console.log(0);
      return new PromiseLike((resolve, reject) => {
        resolve(4);
      });
    })
    .then(res => {
      console.log(res);
    });

  new PromiseLike((resolve, reject) => {
    resolve();
  })
    .then(() => {
      console.log(1);
    })
    .then(() => {
      console.log(2);
    })
    .then(() => {
      console.log(3);
    })
    .then(() => {
      console.log(5);
    })
    .then(() => {
      console.log(6);
    });
}

function promise() {
  console.clear();
  new Promise<void>((resolve, reject) => {
    resolve();
  })
    .then(() => {
      console.log(0);
      return new Promise((resolve, reject) => {
        resolve(4);
      });
    })
    .then(res => {
      console.log(res);
    });

  new Promise<void>((resolve, reject) => {
    resolve();
  })
    .then(() => {
      console.log(1);
    })
    .then(() => {
      console.log(2);
    })
    .then(() => {
      console.log(3);
    })
    .then(() => {
      console.log(5);
    })
    .then(() => {
      console.log(6);
    });
}
