import type { NewAbstractSyntaxTree } from "./transformer";

export interface Token {
  type: "paren" | "number" | "string" | "name";
  value: string;
}

export interface BaseTree {
  type: string;
  _context?: NewAbstractSyntaxTree[];
}

export interface NumberLiteral extends BaseTree {
  type: "NumberLiteral";
  value: string;
}

export interface StringLiteral extends BaseTree {
  type: "StringLiteral";
  value: string;
}

export interface CallExpression extends BaseTree {
  type: "CallExpression";
  name: string;
  params: AbstractSyntaxTree[];
}

export interface Program extends BaseTree {
  type: "Program";
  body: AbstractSyntaxTree[];
}

export type AbstractSyntaxTree = NumberLiteral | StringLiteral | CallExpression | Program;

const WHITESPACE_REG = /\s/;

const NUMBER_REG = /[0-9]/;

const NAME_REG = /[a-z]/i;

export function tokenizer(code: string) {
  let current = 0; // current cursor index
  const tokens: Token[] = [];

  while (current < code.length) {
    let char = code[current];
    // paren
    if (char === "(" || char === ")") {
      tokens.push({
        type: "paren",
        value: char,
      });

      current++;
      continue;
    }

    // whitespace
    if (WHITESPACE_REG.test(char)) {
      current++;
      continue;
    }

    // number
    if (NUMBER_REG.test(char)) {
      let value = "";

      while (NUMBER_REG.test(char)) {
        value += char;
        current++;
        char = code[current];
      }

      tokens.push({
        type: "number",
        value,
      });

      continue;
    }

    // string
    // eslint-disable-next-line @typescript-eslint/quotes
    if (char === '"') {
      let value = "";

      current++;
      char = code[current];

      // eslint-disable-next-line @typescript-eslint/quotes
      while (char !== '"') {
        value += char;
        current++;
        char = code[current];
      }

      current++;
      char = code[current];

      tokens.push({
        type: "string",
        value,
      });

      continue;
    }

    // name
    if (NAME_REG.test(char)) {
      let value = "";

      while (NAME_REG.test(char)) {
        value += char;
        current++;
        char = code[current];
      }

      tokens.push({
        type: "name",
        value,
      });

      continue;
    }

    throw new TypeError(`Unknown token: ${char}`);
  }

  return tokens;
}

export function parser(tokens: Token[]) {
  let current = 0; // current cursor index

  function walk() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;

      return {
        type: "NumberLiteral",
        value: token.value,
      } as NumberLiteral;
    }

    if (token.type === "string") {
      current++;

      return {
        type: "StringLiteral",
        value: token.value,
      } as StringLiteral;
    }

    if (token.type === "paren" && token.value === "(") {
      current++;
      token = tokens[current];

      const node: CallExpression = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };

      current++;
      token = tokens[current];

      while (token.type !== "paren" || (token.type === "paren" && token.value !== ")")) {
        node.params.push(walk());
        token = tokens[current];
      }

      current++;

      return node;
    }

    throw new TypeError(`Unknown token: ${token.type}`);
  }

  const ast: Program = {
    type: "Program",
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}
