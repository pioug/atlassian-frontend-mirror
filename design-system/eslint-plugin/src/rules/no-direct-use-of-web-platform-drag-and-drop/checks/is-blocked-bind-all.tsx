// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { CallExpression, isNodeOfType } from 'eslint-codemod-utils';

import { getModuleOfIdentifier } from '../../utils/get-import-node-by-source';
import { isBlockedEventBinding } from '../shared/is-blocked-event-binding';

export function isBlockedBindAll(
  context: Rule.RuleContext,
  node: CallExpression,
): boolean {
  const callee = node.callee;

  if (!isNodeOfType(callee, 'Identifier')) {
    return false;
  }

  if (callee.name !== 'bindAll') {
    return false;
  }

  const module = getModuleOfIdentifier(context.sourceCode, 'bindAll');

  if (module?.moduleName !== 'bind-event-listener') {
    return false;
  }

  const secondArg = node.arguments[1];

  if (!isNodeOfType(secondArg, 'ArrayExpression')) {
    return false;
  }

  for (const element of secondArg.elements) {
    if (!element) {
      continue;
    }

    if (!isNodeOfType(element, 'ObjectExpression')) {
      continue;
    }

    for (const property of element.properties) {
      if (isBlockedEventBinding(property)) {
        return true;
      }
    }
  }

  // no exit conditions hit
  return false;
}
