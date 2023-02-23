/* eslint-disable @atlassian/tangerine/import/entry-points */
import type { Rule } from 'eslint';
import {
  callExpression,
  EslintNode,
  Identifier,
  identifier,
  isNodeOfType,
  literal,
  node as nodeFn,
  property,
} from 'eslint-codemod-utils';

import {
  spacing as spacingScale,
  typography as typographyTokens,
} from '@atlaskit/tokens/tokens-raw';

import { isDecendantOfGlobalToken } from '../utils/is-node';

import {
  convertHyphenatedNameToCamelCase,
  emToPixels,
  findParentNodeForLine,
  getRawExpression,
  getValue,
  getValueFromShorthand,
  isSpacingProperty,
  isTypographyProperty,
  isValidSpacingValue,
} from './utils';

type TargetOptions = ('spacing' | 'typography')[];

/**
 * Currently we have a wide range of experimental spacing tokens that we are testing.
 * We only want transforms to apply to the stable scale values, not the rest.
 * This could be removed in the future.
 */
const onlyScaleTokens = spacingScale.filter((token) =>
  token.name.startsWith('space.'),
);
const spacingValueToToken = Object.fromEntries(
  onlyScaleTokens.map((token) => [token.attributes['pixelValue'], token.name]),
);

const typographyValueToToken = Object.fromEntries(
  typographyTokens.map((currentToken) => {
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
              ? [token.value.replaceAll(`"`, `'`), token.name]
              : [],
          )
          .filter((token) => token.length),
      ),
    ];
  }),
);

/**
 * Returns a token node for a given value including fallbacks.
 * @param propertyName camelCase CSS property
 * @param value string representing pixel value, or font family, or number representing font weight
 * @example
 * ```
 * propertyName: padding, value: '8px' => token('space.100', '8px')
 * propertyName: fontWeight, value: 400 => token('font.weight.regular', '400')
 * ```
 */
function getTokenNodeForValue(propertyName: string, value: string) {
  const token = isTypographyProperty(propertyName)
    ? typographyValueToToken[propertyName][value]
    : spacingValueToToken[value];
  const fallbackValue =
    propertyName === 'fontFamily'
      ? { value: `${value}`, raw: `\"${value}\"` }
      : `${value}`;

  return callExpression({
    callee: identifier({ name: 'token' }),
    arguments: [
      literal({
        value: `'${token ?? ''}'`,
      }),
      literal(fallbackValue),
    ],
    optional: false,
  });
}

/**
 * Returns a boolean that signals wether the current property is revelant under the current configuration
 * @param propertyName camelCase CSS property
 * @param targetOptions Array containing the types of properties that should be included in the rule
 * @example
 * ```
 * propertyName: padding, targetOptions: ['spacing']
 * propertyName: fontWeight, targetOptions: ['spacing', 'typography']
 * ```
 */
function shouldAnalyzeProperty(
  propertyName: string,
  targetOptions: TargetOptions,
): boolean {
  if (isSpacingProperty(propertyName) && targetOptions.includes('spacing')) {
    return true;
  }
  if (
    isTypographyProperty(propertyName) &&
    targetOptions.includes('typography')
  ) {
    return true;
  }
  return false;
}
/**
 * Attempts to remove all non-essential words & characters from a style block.
 * Including selectors and queries
 * Adapted from ensure-design-token-usage
 * @param styleString string of css properties
 */
function splitCssProperties(styleString: string): string[] {
  return styleString
    .split('\n')
    .filter((line) => !line.trim().startsWith('@'))
    .join('\n')
    .replace(/\n/g, '')
    .split(/;|(?<!\$){|(?<!\${.+?)}/) // don't split on template literal expressions i.e. `${...}`
    .map((el) => el.trim() || '')
    .filter(Boolean);
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Rule ensures all spacing CSS properties apply a matching spacing token',
      recommended: true,
    },
    messages: {
      noRawSpacingValues:
        'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<{{payload}}>>',
    },
  },
  create(context) {
    const targetCategories: TargetOptions = ['spacing'];
    const configCategories = context.options[0]?.addons;
    if (
      Array.isArray(configCategories) &&
      configCategories.includes('typography')
    ) {
      targetCategories.push('typography');
    }

    return {
      // CSSObjectExpression
      // const styles = css({ color: 'red', margin: '4px' })
      'CallExpression[callee.name=css] > ObjectExpression': (
        parentNode: Rule.Node,
      ) => {
        if (!isNodeOfType(parentNode, 'ObjectExpression')) {
          return;
        }

        /**
         * We do this in case the fontSize for a style object is declared alongside the `em` or `lineHeight` declaration
         */
        const fontSizeNode = parentNode.properties.find((node) => {
          if (!isNodeOfType(node, 'Property')) {
            return;
          }

          if (!isNodeOfType(node.key, 'Identifier')) {
            return;
          }

          return node.key.name === 'fontSize';
        });

        const fontSizeValue = getValue(
          // @ts-expect-error
          isNodeOfType(fontSizeNode, 'Property') && fontSizeNode.value,
          context,
        );

        const fontSize = Array.isArray(fontSizeValue)
          ? fontSizeValue[0]
          : fontSizeValue;

        function findObjectStyles(node: EslintNode): void {
          if (!isNodeOfType(node, 'Property')) {
            return;
          }

          if (isNodeOfType(node.value, 'ObjectExpression')) {
            return node.value.properties.forEach(findObjectStyles);
          }

          if (!isNodeOfType(node.key, 'Identifier')) {
            return;
          }

          if (!shouldAnalyzeProperty(node.key.name, targetCategories)) {
            return;
          }

          if (isDecendantOfGlobalToken(node.value)) {
            return;
          }

          if (
            isNodeOfType(node.value, 'TemplateLiteral') &&
            node.value.expressions.some(isDecendantOfGlobalToken)
          ) {
            return;
          }
          if (
            node.value.type === 'Literal' &&
            !isValidSpacingValue(node.value.value, fontSize)
          ) {
            context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `NaN:${node.value.value}`,
              },
            });
            return;
          }

          const propertyName = (node.key as Identifier).name;
          const isFontFamily = /fontFamily/.test(propertyName);

          const value = getValue(node.value, context);

          // value is either NaN or it can't be resolved eg, em, 100% etc...
          if (!(value && isValidSpacingValue(value, fontSize))) {
            return context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `NaN:${value}`,
              },
            });
          }

          const values = Array.isArray(value) ? value : [value];

          // value is a single value so we can apply a more robust approach to our fix
          // treat fontFamily as having one value
          if (values.length === 1 || isFontFamily) {
            const [value] = values;
            const pixelValue = isFontFamily
              ? value
              : emToPixels(value, fontSize);

            return context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `${propertyName}:${pixelValue}`,
              },
              fix: (fixer) => {
                if (!shouldAnalyzeProperty(propertyName, targetCategories)) {
                  return null;
                }

                const pixelValueString = `${pixelValue}px`;

                const lookupValue = /fontWeight|fontFamily/.test(propertyName)
                  ? pixelValue
                  : pixelValueString;

                const tokenName = isTypographyProperty(propertyName)
                  ? typographyValueToToken[propertyName][lookupValue]
                  : spacingValueToToken[lookupValue];

                if (!tokenName) {
                  return null;
                }

                const replacementValue = getTokenNodeForValue(
                  propertyName,
                  lookupValue,
                );

                return [
                  fixer.insertTextBefore(
                    node,
                    `// TODO Delete this comment after verifying spacing token -> previous value \`${nodeFn(
                      node.value,
                    )}\`\n${' '.padStart(node.loc?.start.column || 0)}`,
                  ),
                  fixer.replaceText(
                    node,
                    property({
                      ...node,
                      value: replacementValue,
                    }).toString(),
                  ),
                ];
              },
            });
          }

          /**
           * Compound values are hard to deal with / replace because we need to find/replace strings inside an
           * estree node.
           *
           * @example
           * { padding: '8px 0px' } // two values we don't try and apply the fixer
           */
          values.forEach((val, index) => {
            const pixelValue = emToPixels(val, fontSize);

            context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `${propertyName}:${pixelValue}`,
              },
              fix:
                index === 0
                  ? (fixer) => {
                      const allResolvableValues = values.every(
                        (value) => !Number.isNaN(emToPixels(value, fontSize)),
                      );
                      if (!allResolvableValues) {
                        return null;
                      }
                      return fixer.replaceText(
                        node.value,
                        `\`${values
                          .map((value) => {
                            const pixelValue = emToPixels(value, fontSize);
                            const pixelValueString = `${pixelValue}px`;
                            return `\${${getTokenNodeForValue(
                              propertyName,
                              pixelValueString,
                            )}}`;
                          })
                          .join(' ')}\``,
                      );
                    }
                  : undefined,
            });
          });
        }

        parentNode.properties.forEach(findObjectStyles);
      },

      // CSSTemplateLiteral and StyledTemplateLiteral
      // const cssTemplateLiteral = css`color: red; padding: 12px`;
      // const styledTemplateLiteral = styled.p`color: red; padding: 8px`;
      'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"]':
        (node: Rule.Node) => {
          if (node.type !== 'TaggedTemplateExpression') {
            return;
          }

          const parentNode = findParentNodeForLine(node);

          const combinedString = node.quasi.quasis
            .map((q, i) => {
              return `${q.value.raw}${
                node.quasi.expressions[i]
                  ? getValue(node.quasi.expressions[i], context)
                  : ''
              }`;
            })
            .join('');

          const rawString = node.quasi.quasis
            .map((q, i) => {
              return `${q.value.raw}${
                node.quasi.expressions[i]
                  ? `\${${getRawExpression(
                      node.quasi.expressions[i],
                      context,
                    )}}`
                  : ''
              }`;
            })
            .join('');

          const cssProperties = splitCssProperties(combinedString);
          const unalteredCssProperties = splitCssProperties(rawString);

          // Get font size
          const fontSizeNode = cssProperties.find((style) => {
            const [rawProperty, value] = style.split(':');
            return /font-size/.test(rawProperty) ? value : null;
          });
          const fontSize = getValueFromShorthand(fontSizeNode)[0] as number;

          cssProperties.forEach((style, currentPropIndex) => {
            const [rawProperty, value] = style.split(':');
            const propertyName = convertHyphenatedNameToCamelCase(rawProperty);

            if (!shouldAnalyzeProperty(propertyName, targetCategories)) {
              return;
            }

            // value is either NaN or it can't be resolved eg, em, 100% etc...
            if (!isValidSpacingValue(value, fontSize)) {
              return context.report({
                node,
                messageId: 'noRawSpacingValues',
                data: {
                  payload: `NaN:${value}`,
                },
              });
            }

            const values = getValueFromShorthand(value);

            values.forEach((val, index) => {
              if (
                (!val && val !== 0) ||
                !shouldAnalyzeProperty(propertyName, targetCategories)
              ) {
                return;
              }

              const isFontFamily = /fontFamily/.test(propertyName);
              const pixelValue = isFontFamily ? val : emToPixels(val, fontSize);

              context.report({
                node,
                messageId: 'noRawSpacingValues',
                data: {
                  payload: `${propertyName}:${pixelValue}`,
                },
                fix:
                  index === 0
                    ? (fixer) => {
                        const allResolvableValues = values.every(
                          (value) => !Number.isNaN(emToPixels(value, fontSize)),
                        );
                        if (!allResolvableValues) {
                          return null;
                        }

                        const replacementValue = values
                          .map((value) => {
                            const propertyValue =
                              typeof value === 'string' ? value.trim() : value;

                            const pixelValue = isFontFamily
                              ? propertyValue
                              : emToPixels(propertyValue, fontSize);
                            const pixelValueString = `${pixelValue}px`;

                            const lookupValue = /fontWeight|fontFamily/.test(
                              propertyName,
                            )
                              ? pixelValue
                              : pixelValueString;

                            const tokenName = isTypographyProperty(propertyName)
                              ? typographyValueToToken[propertyName][
                                  lookupValue
                                ]
                              : spacingValueToToken[lookupValue];

                            if (!tokenName) {
                              return pixelValueString;
                            }

                            const replacementTokenValue = getTokenNodeForValue(
                              propertyName,
                              lookupValue,
                            );

                            // ${token('...', '...')}
                            const replacementSubValue =
                              '${' + replacementTokenValue.toString() + '}';
                            return replacementSubValue;
                          })
                          .join(' ');

                        // get original source
                        const textForSource = context
                          .getSourceCode()
                          .getText(node.quasi);

                        // find `<property>: ...;` in original
                        const styleString =
                          unalteredCssProperties[currentPropIndex];
                        // replace property:val with new property:val
                        const replacement = textForSource.replace(
                          styleString, //  padding: ${gridSize()}px;
                          `${rawProperty}: ${replacementValue}`,
                        );

                        if (!replacement) {
                          return [];
                        }

                        return [
                          fixer.insertTextBefore(
                            parentNode,
                            `// TODO Delete this comment after verifying spacing token -> previous value \`${value.trim()}\`\n`,
                          ),
                          fixer.replaceText(node.quasi, replacement),
                        ];
                      }
                    : undefined,
              });
            });
          });
        },
    };
  },
};

export default rule;
