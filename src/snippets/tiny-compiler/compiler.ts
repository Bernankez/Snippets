import { parser, tokenizer } from "./parser";
import { codeGenerator, transformer } from "./transformer";

export function compiler(code: string) {
  const tokens = tokenizer(code);
  const ast = parser(tokens);
  const newAst = transformer(ast);
  const output = codeGenerator(newAst);

  return output;
}
