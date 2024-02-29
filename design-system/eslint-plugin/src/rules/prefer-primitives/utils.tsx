import {
  type EslintNode,
  isNodeOfType,
  type JSXElement,
  JSXIdentifier,
  type JSXText,
} from 'eslint-codemod-utils';

export const validPrimitiveElements = new Set([
  'div',
  'span',
  'article',
  'aside',
  'dialog',
  'footer',
  'header',
  'li',
  'main',
  'nav',
  'ol',
  'section',
  'ul',
  'button',
]);

type JSXChild =
  | 'JSXElement'
  | 'JSXExpressionContainer'
  | 'JSXFragment'
  | 'JSXText'
  | 'JSXSpreadChild'[];
const getChildrenByType = (node: JSXElement, types: JSXChild[]) => {
  return node.children.filter((child: EslintNode) => {
    return types.find((type) => isNodeOfType(child, type as any));
  });
};

const isValidPrimitiveElement = (node: JSXElement) => {
  return validPrimitiveElements.has(
    (node.openingElement.name as JSXIdentifier).name,
  );
};

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
    (child: EslintNode) => (child as JSXText).value.trim() !== '',
  );
  if (nonWhiteSpaceTextChildren.length > 0) {
    return false;
  }

  return true;
};
