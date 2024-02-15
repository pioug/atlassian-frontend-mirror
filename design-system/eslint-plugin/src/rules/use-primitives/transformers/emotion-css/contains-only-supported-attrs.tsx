import {
  isNodeOfType,
  JSXAttribute,
  JSXElement,
  JSXSpreadAttribute,
} from 'eslint-codemod-utils';

import * as ast from '../../../../ast-nodes';

import * as supported from './supported';

/**
 * Check that every attribute in the JSXElement is something we support.
 * We do this via a whitelist in `this.attributes`. The result is we exclude
 * dangerous attrs like `id` and `style`.
 */
export const containsOnlySupportedAttrs = (node: JSXElement) => {
  const attrs = ast.JSXElement.getAttributes(node);

  return attrs.every((attr: JSXAttribute | JSXSpreadAttribute) => {
    if (!isNodeOfType(attr, 'JSXAttribute')) {
      return false;
    }

    const name = ast.JSXAttribute.getName(attr);

    return supported.attributes.includes(name);
  });
};
