import { EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { shape as shapeTokens } from '@atlaskit/tokens/tokens-raw';

const shapeProperties = [
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderRadius',
];

export const radiusValueToToken = Object.fromEntries(
  shapeTokens
    .filter((t) => t.name.startsWith('border.radius'))
    .map((t) => {
      const value = t.value === '4px' ? '3px' : t.value;
      return [value, t.name];
    }),
);

export function isShapeProperty(propertyName: string) {
  return shapeProperties.includes(propertyName);
}

export function isBorderRadius(node: EslintNode) {
  return (
    isNodeOfType(node, 'CallExpression') &&
    isNodeOfType(node.callee, 'Identifier') &&
    (node.callee.name === 'borderRadius' ||
      node.callee.name === 'getBorderRadius')
  );
}
