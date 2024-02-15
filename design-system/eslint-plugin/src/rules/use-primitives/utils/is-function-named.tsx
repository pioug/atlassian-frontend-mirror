import type { Scope } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

export const isFunctionNamed = (
  node: Scope.Definition | undefined,
  name: string,
) => {
  if (!node) {
    return false;
  }

  if (!isNodeOfType(node.node.init, 'CallExpression')) {
    return false;
  }

  if (!isNodeOfType(node.node.init.callee, 'Identifier')) {
    return false;
  }

  return node.node.init.callee.name === name;
};
