import type { Scope } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import {
  hasStyleObjectArguments,
  isCssMap,
  isKeyframes,
} from './is-supported-import';

export function walkStyleProperties(
  callExpression: ESTree.CallExpression,
  referencesInScope: Scope.Reference[],
  importSources: string[],
  callback: (property: ESTree.Property) => void,
) {
  if (
    !hasStyleObjectArguments(callExpression, referencesInScope, importSources)
  ) {
    return;
  }

  if (
    isKeyframes(callExpression, referencesInScope, importSources) ||
    isCssMap(callExpression, referencesInScope, importSources)
  ) {
    _walkStyleProperties(callExpression, callback, true);
    return;
  }

  _walkStyleProperties(callExpression, callback);
}

function _walkStyleProperties(
  callExpression: ESTree.CallExpression,
  callback: (property: ESTree.Property) => void,
  skipCallback = false,
) {
  callExpression.arguments.forEach(argument => {
    /**
     * Plain object arguments
     */
    if (argument.type === 'ObjectExpression') {
      walkStyleObject(argument, callback, skipCallback);
    }

    /**
     * Arrow functions of the form
     *
     * ```ts
     * () => ({ ... })
     * ```
     */
    if (
      argument.type === 'ArrowFunctionExpression' &&
      argument.expression &&
      argument.body.type === 'ObjectExpression'
    ) {
      walkStyleObject(argument.body, callback, skipCallback);
    }
  });
}

function walkStyleObject(
  node: ESTree.ObjectExpression,
  callback: (property: ESTree.Property) => void,
  skipCallback = false,
) {
  node.properties.forEach(property => {
    // We might want to handle spread elements in the future..?
    if (property.type !== 'Property') {
      return;
    }

    if (!skipCallback) {
      callback(property);
    }

    if (property.value.type === 'ObjectExpression') {
      walkStyleObject(property.value, callback);
    }
  });
}
