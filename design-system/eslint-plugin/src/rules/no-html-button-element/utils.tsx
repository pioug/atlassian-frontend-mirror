import { type JSXElement, JSXIdentifier } from 'eslint-codemod-utils';

const isButtonHtmlElement = (node: JSXElement) => {
  return (node.openingElement.name as JSXIdentifier).name === 'button';
};

export const shouldSuggest = (node: JSXElement): boolean => {
  if (!node) {
    return false;
  }

  if (!isButtonHtmlElement(node)) {
    return false;
  }

  return true;
};
