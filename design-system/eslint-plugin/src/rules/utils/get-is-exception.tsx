// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const getNodeValue = (node: Rule.Node): string | null => {
  switch (node.type) {
    case 'Identifier':
      return node.name;
    case 'Literal':
      return typeof node.value === 'string' ? node.value : null;
    case 'CallExpression':
      return node.callee.type === 'Identifier' ? node.callee.name : null;
    case 'JSXAttribute':
      return node.value?.type === 'Literal' &&
        typeof node.value.value === 'string'
        ? node.value.value
        : null;
    default:
      return null;
  }
};

export const getIsException = (
  exceptions?: string[],
): ((node: Rule.Node) => boolean) => {
  if (!exceptions?.length) {
    return () => false;
  }

  const exceptionsSet = new Set(exceptions.map((x) => x.toLowerCase()));
  const isException = (node: Rule.Node): boolean => {
    const value = getNodeValue(node);
    if (value) {
      const splitValues = value.split(/[-_\s]+/);
      if (splitValues.some((v) => exceptionsSet.has(v.toLowerCase()))) {
        return true;
      }
    }
    if (node.parent) {
      return isException(node.parent);
    }
    return false;
  };
  return isException;
};
