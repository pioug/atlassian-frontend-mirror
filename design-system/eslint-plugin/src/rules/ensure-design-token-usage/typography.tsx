import { CallExpression, EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { typographyAdg3 as typographyTokens } from '@atlaskit/tokens/tokens-raw';

const typographyProperties = [
  'fontSize',
  'fontWeight',
  'fontFamily',
  'lineHeight',
];

export const isTypographyProperty = (propertyName: string) => {
  return typographyProperties.includes(propertyName);
};

export const isFontSize = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  (node.callee.name === 'fontSize' || node.callee.name === 'getFontSize');

export const isFontSizeSmall = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  node.callee.name === 'fontSizeSmall';

export const isFontFamily = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  (node.callee.name === 'fontFamily' || node.callee.name === 'getFontFamily');

export const isCodeFontFamily = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  (node.callee.name === 'codeFontFamily' ||
    node.callee.name === 'getCodeFontFamily');

export const typographyValueToToken = Object.fromEntries(
  typographyTokens
    // we're filtering here to remove the `font` tokens.
    .filter((t) => t.attributes.group !== 'typography')
    .map((currentToken) => {
      // Group tokens by property name (e.g. fontSize, fontFamily, lineHeight)
      // This allows us to look up values specific to a property
      // (so as not to mix tokens with overlapping values e.g. font size and line height both have tokens for 16px)
      const tokenGroup = currentToken.attributes.group;
      return [
        tokenGroup,
        Object.fromEntries(
          typographyTokens
            .map((token) =>
              token.attributes.group === tokenGroup
                ? [(token.value as string).replaceAll(`"`, `'`), token.name]
                : [],
            )
            .filter((token) => token.length),
        ),
      ];
    }),
);
