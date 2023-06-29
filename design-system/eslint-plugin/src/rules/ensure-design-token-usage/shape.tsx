import { EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { shape as shapeTokens } from '@atlaskit/tokens/tokens-raw';

const shapeProperties = [
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderRadius',
];

const borderSizeProperties = [
  'borderWidth',
  'outlineWidth',
  'borderRightWidth',
  'borderLeftWidth',
  'borderTopWidth',
  'borderBottomWidth',
  'borderInlineWidth',
  'borderBlockWidth',
];

export const radiusValueToToken = Object.fromEntries(
  shapeTokens
    .filter((t) => t.name.startsWith('border.radius'))
    .map((t) => {
      const value = t.value === '4px' ? '3px' : t.value;
      return [value, t.name];
    }),
);

export const borderWidthValueToToken = Object.fromEntries(
  shapeTokens
    .filter((t) => t.name.startsWith('border.width'))
    .map((t) => [t.value, t.name]),
);

export function isRadiusProperty(propertyName: string) {
  return shapeProperties.includes(propertyName);
}

export function isBorderSizeProperty(propertyName: string) {
  return borderSizeProperties.includes(propertyName);
}

export function isShapeProperty(propertyName: string) {
  return isRadiusProperty(propertyName) || isBorderSizeProperty(propertyName);
}

export function isBorderRadius(node: EslintNode) {
  return (
    isNodeOfType(node, 'CallExpression') &&
    isNodeOfType(node.callee, 'Identifier') &&
    (node.callee.name === 'borderRadius' ||
      node.callee.name === 'getBorderRadius')
  );
}
