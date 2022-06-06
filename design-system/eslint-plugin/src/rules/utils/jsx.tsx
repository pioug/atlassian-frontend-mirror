import type { JSXAttribute, JSXElement } from 'eslint-codemod-utils';

export function findProp(jsx: JSXElement, propName: string) {
  const labelProp = jsx.openingElement.attributes.find(
    (attr): attr is JSXAttribute =>
      attr.type === 'JSXAttribute' && attr.name.name === propName,
  );

  return labelProp;
}
