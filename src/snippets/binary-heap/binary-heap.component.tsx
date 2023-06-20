import { createEffect, createSignal, on } from "solid-js";
import { BinaryHeap } from "./binary-heap";

export function BinaryHeapComponent() {
  const [inputs, setInputs] = createSignal("");
  const [elements, setElements] = createSignal<number[]>([]);
  const [pushInput, setPushInput] = createSignal("");
  const [history, setHistory] = createSignal<string[]>([], { equals: false });

  let inputElement: HTMLInputElement | undefined;

  createEffect(
    on(elements, (elements) => {
      const h = history();
      h.push(JSON.stringify(elements));
      setHistory(h);
      inputElement?.scrollTo(0, inputElement.scrollHeight);
    }),
  );

  let heap: BinaryHeap<number> | undefined;

  function generate() {
    const el = inputs()
      .split(",")
      .filter(item => !!item)
      .map(item => Number(item.trim()) || 0);
    heap = new BinaryHeap((a, b) => {
      if (type() === "max") { return a > b; }
      return a < b;
    }, el);
    setElements(heap.heap);
  }

  function onPush() {
    heap?.push(Number(pushInput()) || 0);
    setElements(heap?.heap || []);
  }

  function onClear() {
    setHistory([]);
    setPushInput("");
  }

  const [type, setType] = createSignal("max");

  return (
    <div>
      <div class="flex flex-wrap items-center flex-gap-3">
        <input
          placeholder="输入数字，使用,分隔"
          value={inputs()}
          onInput={(e) => {
            setInputs(e.target.value);
          }}
        ></input>
        <label>
          <input name="heap" type="radio" value="max" checked={type() === "max"} onInput={(e) => { setType(e.target.value); }}></input>
          <span class="m-l-1">最大堆</span>
        </label>
        <label>
          <input name="heap" type="radio" value="min" checked={type() === "min"} onInput={(e) => { setType(e.target.value); }}></input>
          <span class="m-l-1">最小堆</span>
        </label>
        <button onClick={generate}>生成</button>
        <button onClick={() => { heap?.pop(); setElements(heap?.heap || []); }}>pop</button>
        <input value={pushInput()} onInput={e => setPushInput(e.target.value)} class="w-12"></input>
        <button onClick={onPush}>push</button>
        <button onClick={onClear}>清空</button>
      </div>
      <pre class="m-t-3 max-h-30 overflow-y-auto" ref={inputElement}>{history().join("\n")}</pre>
    </div>
  );
}
