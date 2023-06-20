import { createSignal } from "solid-js";
import { QuickSort } from "../quick-sort/quick-sort";
import { BinarySearch } from "./binary-search";

export function BinarySearchComponent() {
  let binarySearch: BinarySearch | undefined;

  const [input, setInput] = createSignal("");
  const [searchValue, setSearchValue] = createSignal("");
  const [elements, setElements] = createSignal<number[]>([]);
  const [result, setResult] = createSignal("");

  function generate() {
    setElements(
      input()
        .split(",")
        .filter(item => !!item)
        .map(item => Number(item.trim()) || 0),
    );
  }

  function sort() {
    const sorted = QuickSort(elements());
    setElements(sorted);
    binarySearch = new BinarySearch(sorted);
  }

  function search() {
    if (Number.isNaN(Number(searchValue()))) {
      alert("请输入数字");
      return;
    }
    setResult(binarySearch?.search(Number(searchValue()))?.toString() ?? "");
  }

  return (
    <div class="flex flex-col flex-gap-3">
      <div class="flex flex-wrap flex-gap-3">
        <input
          placeholder="输入数字，使用,分隔"
          value={input()}
          onInput={e => setInput(e.target.value)}
        />
        <button onClick={generate}>生成</button>
        <button onClick={sort}>排序</button>
        <input
          class="w-15"
          value={searchValue()}
          onInput={e => setSearchValue(e.target.value)}
        />
        <button onClick={search}>搜索</button>
      </div>
      <pre>{`${JSON.stringify(elements())}\n${result() && `索引为：${result()}`}`}</pre>
    </div>
  );
}
