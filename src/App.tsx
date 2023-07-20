import dayjs from "dayjs";
import { time } from "virtual:build-info";
import { Home } from "./pages/home";

export function App() {
  return (
    <div>
      <Home />
      <div class="m-t-3 flex items-center justify-center flex-gap-2 text-4.5 text-gray-50">
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
        {/* TODO time disappeared */}
        <samp>上次更新于 {dayjs(time).format("YYYY-MM-DD HH:mm:ss")}</samp>
      </div>
    </div>
  );
}
