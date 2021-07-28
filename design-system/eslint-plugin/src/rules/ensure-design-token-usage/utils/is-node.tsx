import type { Rule } from 'eslint';

export const isDecendantOfGlobalToken = (node: Rule.Node): boolean => {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'token'
  ) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfGlobalToken(node.parent);
  }

  return false;
};

export const isDecendantOfType = (
  node: Rule.Node,
  type: Rule.Node['type'],
  skipNode = true,
): boolean => {
  if (!skipNode && node.type === type) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfType(node.parent, type, false);
  }

  return false;
};

export const isChildOfType = (node: Rule.Node, type: Rule.Node['type']) =>
  node.parent.type === type;
