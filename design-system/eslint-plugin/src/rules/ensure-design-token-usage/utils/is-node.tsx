import type { Rule } from 'eslint';

export const isParentGlobalToken = (node: Rule.Node): boolean => {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'token'
  ) {
    return true;
  }

  if (node.parent) {
    return isParentGlobalToken(node.parent);
  }

  return false;
};
