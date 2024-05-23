import { type CallExpression, isNodeOfType } from 'eslint-codemod-utils';

import { blockedEventNameLookup } from '../shared/blocked';

export function isBlockedAddEventListener(node: CallExpression): boolean {
  const callee = node.callee;

  if (!isNodeOfType(callee, 'MemberExpression')) {
    return false;
  }

  const property = callee.property;

  if (!isNodeOfType(property, 'Identifier')) {
    return false;
  }

  if (property.name !== 'addEventListener') {
    return false;
  }

  // check the first argument
  const first = node.arguments[0];

  // only checking literals for this eslint rule
  if (!isNodeOfType(first, 'Literal')) {
    return false;
  }

  const value = first.value;

  return typeof value === 'string' && blockedEventNameLookup.has(value);
}
