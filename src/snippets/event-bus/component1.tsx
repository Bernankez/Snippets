import { createSignal } from "solid-js";
import { $emit } from "./event-bus";

export function Component1() {
  const emit = () => {
    $emit("time", `现在是${new Date().toLocaleTimeString()}`);
  };

  const [autoEmiting, setAutoEmiting] = createSignal(false);
  const autoEmit = () => {
    setAutoEmiting(true);

    const FRAME = 60;
    const [count, setCount] = createSignal(0);
    function refresh() {
      setCount(count() + 1);
      if (count() === 1) {
        $emit("time", `现在是${new Date().toLocaleTimeString()}`);
      } else if (count() >= FRAME) {
        setCount(0);
      }
      if (autoEmiting()) {
        requestAnimationFrame(refresh);
      }
    }

    requestAnimationFrame(refresh);
  };

  const stopAutoEmit = () => {
    setAutoEmiting(false);
  };

  return <div class="flex flex-wrap flex-gap-3">
    <button onClick={emit}>emit</button>
    <button onClick={autoEmit}>auto emit</button>
    <button onClick={stopAutoEmit}>stop auto emit</button>
  </div>;
}
