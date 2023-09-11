import { render } from "solid-js/web";
import "./style.css";
import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import { time } from "virtual:build-info";
import dayjs from "dayjs";
import { Home } from "./pages/home";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <div>
      <Home />
      <div class="m-t-3 flex cursor-default items-center justify-center flex-gap-2 text-4.5 text-gray-50">
        <a href="https://keke.cc" target="_blank" rel="noreferrer">
          @科科cole
        </a>
        <span class="font-bold">·</span>
        <a
          href="https://github.com/Bernankez/Snippets"
          target="_blank"
          class="i-fa6-brands:github-alt text-6"
          rel="noreferrer"
        ></a>
        <span class="font-bold">·</span>
        <samp>上次更新于 {dayjs(time).format("YYYY-MM-DD HH:mm:ss")}</samp>
      </div>
    </div>
  ),
  root!,
);
