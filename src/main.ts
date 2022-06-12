import "./style.css";
import { order } from "./state-machine";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;

console.log(order.state);
order.pay();
console.log(order.state);
order.reserve();
order.cancelReserve();
console.log(order.state);
order.goto("REPORTED");
console.log(order.state);
