import { BinaryHeapComponent } from "@/snippets/binary-heap/binary-heap.component";

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
  return (<div class="text-gray-50">
    <h1 class="text-9 font-bold">Snippets</h1>
    <ol class="flex flex-col flex-gap-3 p-l-5 text-gray-50">
      <li>
        一个合理的字体设置
        <a class="ref" href="https://github.com/Bernankez/Snippets/blob/master/src/snippets/style.css" target="_blank" rel="noreferrer">Source</a>
      </li>
      <pre>
        {styles}
      </pre>
      <li>
        二叉堆实现（最大堆，最小堆）
        <a class="ref" href="https://github.com/Bernankez/Snippets/blob/master/src/snippets/binary-heap/binary-heap.ts" target="_blank" rel="noreferrer">Source</a>
      </li>
      <BinaryHeapComponent />
    </ol>
  </div>);
}
