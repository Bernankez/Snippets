import { hydrate } from "solid-js/web";
import { App } from "./App";
import "./style.css";
import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";

hydrate(() => <App />, document.getElementById("app")!);
