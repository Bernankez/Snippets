import { describe } from "vitest";
import { parser, tokenizer } from "./parser";
import { transformer } from "./transformer";
import { compiler } from "./compiler";

const sourceCode = "(add 2 (subtract 4 2))";

describe("tokenizer", () => {
  it("split into tokens", () => {
    expect(tokenizer(sourceCode)).toMatchInlineSnapshot(`
      [
        {
          "type": "paren",
          "value": "(",
        },
        {
          "type": "name",
          "value": "add",
        },
        {
          "type": "number",
          "value": "2",
        },
        {
          "type": "paren",
          "value": "(",
        },
        {
          "type": "name",
          "value": "subtract",
        },
        {
          "type": "number",
          "value": "4",
        },
        {
          "type": "number",
          "value": "2",
        },
        {
          "type": "paren",
          "value": ")",
        },
        {
          "type": "paren",
          "value": ")",
        },
      ]
    `);
  });

  it("generate ast", () => {
    expect(parser(tokenizer(sourceCode))).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "name": "add",
            "params": [
              {
                "type": "NumberLiteral",
                "value": "2",
              },
              {
                "name": "subtract",
                "params": [
                  {
                    "type": "NumberLiteral",
                    "value": "4",
                  },
                  {
                    "type": "NumberLiteral",
                    "value": "2",
                  },
                ],
                "type": "CallExpression",
              },
            ],
            "type": "CallExpression",
          },
        ],
        "type": "Program",
      }
    `);
  });

  it("transform to new ast", () => {
    expect(transformer(parser(tokenizer(sourceCode)))).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "expression": {
              "arguments": [
                {
                  "type": "NumberLiteral",
                  "value": "2",
                },
                {
                  "arguments": [
                    {
                      "type": "NumberLiteral",
                      "value": "4",
                    },
                    {
                      "type": "NumberLiteral",
                      "value": "2",
                    },
                  ],
                  "callee": {
                    "name": "subtract",
                    "type": "Identifier",
                  },
                  "type": "CallExpression",
                },
              ],
              "callee": {
                "name": "add",
                "type": "Identifier",
              },
              "type": "CallExpression",
            },
            "type": "ExpressionStatement",
          },
        ],
        "type": "Program",
      }
    `);
  });

  it("compile source code", () => {
    const output = compiler(sourceCode);
    // eslint-disable-next-line @typescript-eslint/quotes
    expect(output).toMatchInlineSnapshot('"add(2, subtract(4, 2));"');
  });
});
