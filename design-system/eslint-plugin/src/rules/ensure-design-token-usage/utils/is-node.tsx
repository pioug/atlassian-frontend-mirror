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

export const isAnyParentOfType = (
  node: Rule.Node,
  type: Rule.Node['type'],
  skipNode = true,
): boolean => {
  if (!skipNode && node.type === type) {
    return true;
  }

  if (node.parent) {
    return isAnyParentOfType(node.parent, type, false);
  }

  return false;
};
