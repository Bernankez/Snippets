import { createSignal } from "solid-js";
import { compiler } from "./compiler";

export function TinyCompilerComponent() {
  const [code, setCode] = createSignal("");
  const [output, setOutput] = createSignal("");
  const defaultCode = "(add 2 (subtract 4 2))";

  function compileCode() {
    try {
      const _output = compiler(code());
      setOutput(_output);
    } catch (e: any) {
      setOutput(e.message);
    }
  }

  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === "Tab" && !code()) {
      e.preventDefault();
      setCode(defaultCode);
    }
  }

  return (
    <div class="flex flex-col flex-gap-3">
      <div class="flex flex-gap-3">
        <textarea
          class="w-full"
          rows={4}
          onInput={e => setCode(e.currentTarget.value)}
          placeholder={defaultCode}
          value={code()}
          onKeyDown={handleInputKeydown}
        ></textarea>
        <button onClick={compileCode}>compile</button>
      </div>
      <pre>{output()}</pre>
    </div>
  );
}
