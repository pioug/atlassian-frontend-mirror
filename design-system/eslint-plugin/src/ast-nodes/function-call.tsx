/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
  CallExpression,
  isNodeOfType,
  ObjectExpression,
} from 'eslint-codemod-utils';

export const FunctionCall = {
  getName(node: CallExpression): string | undefined {
    if (!isNodeOfType(node, 'CallExpression')) {
      return undefined;
    }

    if (!isNodeOfType(node.callee, 'Identifier')) {
      return undefined;
    }

    return node.callee.name;
  },

  updateName(
    node: CallExpression,
    newName: string,
    fixer: Rule.RuleFixer,
  ): Rule.Fix {
    return fixer.replaceText(node.callee, newName);
  },

  /**
   * Function arguments can be many things:
   * `css(myStyles, () => {}, undefined, 'literal', ...rest) // etc`
   * They all need slightly different treatment.
   *
   * Currently 'getArgumentAtPos' only implements strategies for Literals and ObjectExpressions.
   * If you need to support another type of arg, add it, and update the type.
   */
  getArgumentAtPos(
    node: CallExpression,
    pos: number,
  ):
    | { type: 'Literal'; value: string }
    | { type: 'ObjectExpression'; value: ObjectExpression }
    | undefined {
    const argument = node.arguments[pos];

    if (isNodeOfType(argument, 'Literal') && argument.value) {
      return { type: 'Literal', value: argument.value?.toString() };
    }

    if (isNodeOfType(argument, 'ObjectExpression')) {
      argument;
      return { type: 'ObjectExpression', value: argument };
    }
  },
};
