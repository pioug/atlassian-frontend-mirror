import type { EslintNode, JSXElement, JSXText } from 'eslint-codemod-utils';

import {
  getChildrenByType,
  isValidPrimitiveElement,
  isWhiteSpace,
} from '../use-primitives/utils';

export const shouldSuggest = (node: JSXElement): boolean => {
  if (!node) {
    return false;
  }

  if (!isValidPrimitiveElement(node)) {
    return false;
  }

  /**
   * Ignore text, check for things like:
   * ```
   * <div>
   *   <h2>heading</h2>
   *   subheading <= rejected because of standalone piece of text
   * </div>
   * ```
   */
  const nonWhiteSpaceTextChildren = getChildrenByType(node, ['JSXText']).filter(
    (child: EslintNode) => !isWhiteSpace((child as JSXText).value),
  );
  if (nonWhiteSpaceTextChildren.length > 0) {
    return false;
  }

  return true;
};
