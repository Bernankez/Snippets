import { createSignal } from "solid-js";
import { $off, $on } from "./event";

export function Component2() {
  const [log, setLog] = createSignal("");

  const on = () => {
    setLog("开始监听");
    $on("time", (time: string) => {
      setLog(time);
    });
  };

  const off = () => {
    setLog("停止监听");
    $off("time");
  };

  return <div>
    <div class="flex flex-wrap flex-gap-3">
      <button onClick={on}>on</button>
      <button onClick={off}>off</button>
    </div>
    <pre>{log()}</pre>
  </div>;
}
