import { createSignal } from "solid-js";
import { compiler } from "./compiler";

export function TinyCompilerComponent() {
  const [code, setCode] = createSignal("");
  const [output, setOutput] = createSignal("");

  function compileCode() {
    try {
      const _output = compiler(code());
      setOutput(_output);
    } catch (e: any) {
      setOutput(e.message);
    }
  }

  return (
    <div class="flex flex-col flex-gap-3">
      <div class="flex flex-gap-3">
        <textarea
          class="w-full"
          rows={4}
          onChange={e => setCode(e.currentTarget.value)}
          placeholder="(add 2 (subtract 4 2))"
          value={code()}
        ></textarea>
        <button onClick={compileCode}>compile</button>
      </div>
      <pre>{output()}</pre>
    </div>
  );
}
