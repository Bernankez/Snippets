import { BinaryHeapComponent } from "@/snippets/binary-heap/binary-heap.component";
import { BinarySearchComponent } from "@/snippets/binary-search/binary-search.component";
import { EventBusComponent } from "@/snippets/event-bus/event-bus.component";
import { QuickSortComponent } from "@/snippets/quick-sort/quick-sort.component";

const styles = `
@font-face {
  font-family: Emoji;
  src: local("Apple Color Emoji"), local("Segoe UI Emoji"), local("Segoe UI Symbol"), local("Noto Color Emoji");
  unicode-range: U+1F000-1F644, U+203C-3299;
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", Rototo, Emoji, Helvetica, Arial, sans-serif;
}
`;

export function Home() {
  return (
    <div class="text-gray-50">
      <h1 class="text-9 font-bold">Snippets</h1>
      <ol class="flex flex-col flex-gap-3 p-l-5 text-gray-50">
        <li>
          一个合理的字体设置
          <a
            class="ref"
            href="https://github.com/Bernankez/Snippets/blob/master/src/snippets/style.css"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </li>
        <pre>{styles}</pre>
        <li>
          二叉堆实现（最大堆，最小堆）
          <a
            class="ref"
            href="https://github.com/Bernankez/Snippets/blob/master/src/snippets/binary-heap/binary-heap.ts"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </li>
        <BinaryHeapComponent />
        <li>
          事件总线（EventBus）
          <a
            class="ref"
            href="https://github.com/Bernankez/Snippets/blob/master/src/snippets/event-bus/event-bus.ts"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </li>
        <EventBusComponent />
        <li>
          二分搜索（BinarySearch）
          <a
            class="ref"
            href="https://github.com/Bernankez/Snippets/blob/master/src/snippets/binary-search/binary-search.ts"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </li>
        <BinarySearchComponent />
        <li>
          快速排序
          <a
            class="ref"
            href="https://github.com/Bernankez/Snippets/blob/master/src/snippets/quick-sort/quick-sort.ts"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </li>
        <QuickSortComponent />
      </ol>
    </div>
  );
}
