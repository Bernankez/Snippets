import { type AbstractSyntaxTree, type CallExpression, type NumberLiteral, type Program, type StringLiteral } from "./parser";

export interface Visitor {
  Program?: {
    enter?: (node: Program) => void;
    exit?: (node: Program) => void;
  };
  NumberLiteral?: {
    enter?: (node: NumberLiteral, parent: AbstractSyntaxTree) => void;
    exit?: (node: NumberLiteral, parent: AbstractSyntaxTree) => void;
  };
  StringLiteral?: {
    enter?: (node: StringLiteral, parent: AbstractSyntaxTree) => void;
    exit?: (node: StringLiteral, parent: AbstractSyntaxTree) => void;
  };
  CallExpression?: {
    enter?: (node: CallExpression, parent: AbstractSyntaxTree) => void;
    exit?: (node: CallExpression, parent: AbstractSyntaxTree) => void;
  };
}

export interface ExpressionStatement {
  type: "ExpressionStatement";
  expression: NewCallExpression;
}

export interface NewCallExpression {
  type: "CallExpression";
  callee: Identifier;
  arguments: NewAbstractSyntaxTree[];
}

export interface Identifier {
  type: "Identifier";
  name: string;
}

export type NewAbstractSyntaxTree = NumberLiteral | StringLiteral | NewCallExpression | ExpressionStatement | NewProgram | Identifier;

export interface NewProgram {
  type: "Program";
  body: NewAbstractSyntaxTree[];
}

export function traverser(ast: AbstractSyntaxTree, visitor: Visitor) {
  function traverseArray(array: AbstractSyntaxTree[], parent: AbstractSyntaxTree) {
    array.forEach((child) => {
      traverserNode(child, parent);
    });
  }

  function traverserNode(node: AbstractSyntaxTree, parent: AbstractSyntaxTree | null) {
    const methods = visitor[node.type];

    if (methods && methods.enter) {
      // @ts-expect-error can be null when node type is Program
      methods.enter(node, parent);
    }

    switch (node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      case "CallExpression":
        traverseArray(node.params, node);
        break;
      case "NumberLiteral":
      case "StringLiteral":
        break;
      default:
        // @ts-expect-error node never
        throw new TypeError(`Unknown node type: ${node.type}`);
    }

    if (methods && methods.exit) {
      // @ts-expect-error can be null when node type is Program
      methods.exit(node, parent);
    }
  }

  traverserNode(ast, null);
}

export function transformer(ast: AbstractSyntaxTree) {
  const newAst: NewProgram = {
    type: "Program",
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context?.push({
          type: "NumberLiteral",
          value: node.value,
        });
      },
    },
    StringLiteral: {
      enter(node, parent) {
        parent._context?.push({
          type: "StringLiteral",
          value: node.value,
        });
      },
    },

    CallExpression: {
      enter(node, parent) {
        let expression: NewAbstractSyntaxTree = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name,
          },
          arguments: [],
        };

        node._context = expression.arguments;

        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression,
          };
        }

        parent._context?.push(expression);
      },
    },
  });

  return newAst;
}

export function codeGenerator(node: NewAbstractSyntaxTree) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGenerator).join("\n");
    case "ExpressionStatement":
      return `${codeGenerator(node.expression)};`;
    case "CallExpression":
      return `${codeGenerator(node.callee)}(${node.arguments.map(codeGenerator).join(", ")})`;
    case "Identifier":
      return node.name;
    case "NumberLiteral":
      return node.value;
    case "StringLiteral":
      return `"${node.value}"`;
    default:
      // @ts-expect-error node never
      throw new TypeError(node.type);
  }
}
