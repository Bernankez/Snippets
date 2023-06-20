import { createSignal } from "solid-js";
import { QuickSort } from "./quick-sort";

export function QuickSortComponent() {
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal<number[]>([]);

  const sort = () => {
    const elements = input()
      .trim()
      .split(",")
      .filter(item => !!item)
      .map(item => Number(item) || 0);
    setOutput(QuickSort(elements));
  };

  return (
    <div class="flex flex-col flex-gap-3">
      <div class="flex flex-wrap flex-gap-3">
        <input
          placeholder="输入数字，使用,分隔"
          value={input()}
          onInput={e => setInput(e.target.value)}
        />
        <button onClick={sort}>排序</button>
      </div>
      <pre>{JSON.stringify(output())}</pre>
    </div>
  );
}
