import { generateHydrationScript, renderToString } from "solid-js/web";
import { App } from "./App";

export function render() {
  const app = renderToString(App);
  const hydration = generateHydrationScript();
  return {
    app,
    hydration,
  };
}
