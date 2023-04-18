/* eslint-disable @atlassian/tangerine/import/entry-points */
import type { Rule } from 'eslint';
import {
  EslintNode,
  Identifier,
  ImportDeclaration,
  isNodeOfType,
  node as nodeFn,
  property,
} from 'eslint-codemod-utils';

import { createRule } from '../utils/create-rule';
import { isDecendantOfGlobalToken } from '../utils/is-node';

import {
  convertHyphenatedNameToCamelCase,
  emToPixels,
  findParentNodeForLine,
  findTokenNameByPropertyValue,
  getFontSizeValueInScope,
  getRawExpression,
  getTokenNodeForValue,
  getTokenReplacement,
  getValue,
  getValueFromShorthand,
  insertTokensImport,
  isTokenValueString,
  isTypographyProperty,
  isValidSpacingValue,
  processCssNode,
  shouldAnalyzeProperty,
  spacingValueToToken,
  splitShorthandValues,
  typographyValueToToken,
} from './utils';

type Addon = 'spacing' | 'typography' | 'shape';
type RuleConfig = {
  addons: Addon[];
  applyImport?: boolean;
};

const rule = createRule<
  [RuleConfig],
  'noRawSpacingValues' | 'autofixesPossible'
>({
  defaultOptions: [{ addons: ['spacing'], applyImport: true }],
  name: 'ensure-design-token-usage-spacing',
  meta: {
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          applyImport: {
            type: 'boolean',
          },
          addons: {
            type: 'array',
            items: {
              enum: ['spacing', 'typography', 'shape'],
            },
          },
        },
      },
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Enforces usage of spacing design tokens rather than hard-coded values.',
      recommended: false,
    },
    messages: {
      noRawSpacingValues:
        'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<{{payload}}>>',
      autofixesPossible:
        'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
    },
  },
  // @ts-expect-error
  create(context: Rule.RuleContext, options: [RuleConfig]) {
    let tokenNode: ImportDeclaration | null = null;

    // merge configs
    const ruleConfig: RuleConfig = {
      ...options[0],
      addons: [...options[0].addons],
    };

    if (!ruleConfig.addons.includes('spacing')) {
      ruleConfig.addons.push('spacing');
    }

    return {
      ImportDeclaration(node) {
        if (
          node.source.value === '@atlaskit/tokens' &&
          ruleConfig.applyImport
        ) {
          tokenNode = node;
        }
      },
      // CSSObjectExpression
      // const styles = css({ color: 'red', margin: '4px' }), styled.div({ color: 'red', margin: '4px' })
      'CallExpression[callee.name=css] > ObjectExpression, CallExpression[callee.object.name=styled] > ObjectExpression, CallExpression[callee.object.name=styled2] > ObjectExpression':
        (parentNode: Rule.Node) => {
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

            if (!shouldAnalyzeProperty(node.key.name, ruleConfig.addons)) {
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
                  if (!shouldAnalyzeProperty(propertyName, ruleConfig.addons)) {
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

                  return (
                    !tokenNode && ruleConfig.applyImport
                      ? [insertTokensImport(fixer)]
                      : []
                  ).concat([
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
                  ]);
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

                        const valuesWithTokenReplacement = values.filter(
                          (value) =>
                            findTokenNameByPropertyValue(propertyName, value),
                        );
                        if (valuesWithTokenReplacement.length === 0) {
                          // all values could be replaceable but that just means they're numeric
                          // if none of the values have token replacement we bail
                          return null;
                        }

                        const originalCssString = getRawExpression(
                          node.value,
                          context,
                        );
                        if (!originalCssString) {
                          return null;
                        }
                        /**
                         * at this stage none of the values are tokens or irreplaceable values
                         * since we know this is shorthand, there will be multiple values
                         * we'll need to remove all quote chars since `getRawExpression` will return those as part of the string
                         * given they're part of the substring of the current node
                         */
                        const originalValues = splitShorthandValues(
                          originalCssString.replace(/`|'|"/g, ''),
                        );
                        if (originalValues.length !== values.length) {
                          // we bail just in case original values don't correspond to the replaced values
                          return null;
                        }

                        return (
                          !tokenNode && ruleConfig.applyImport
                            ? [insertTokensImport(fixer)]
                            : []
                        ).concat([
                          fixer.replaceText(
                            node.value,
                            `\`${values
                              .map((value, index) => {
                                const pixelValue = emToPixels(value, fontSize);
                                const pixelValueString = `${pixelValue}px`;
                                // if there is a token we take it, otherwise we go with the original value
                                return findTokenNameByPropertyValue(
                                  propertyName,
                                  value,
                                )
                                  ? `\${${getTokenNodeForValue(
                                      propertyName,
                                      pixelValueString,
                                    )}}`
                                  : originalValues[index];
                              })
                              .join(' ')}\``,
                          ),
                        ]);
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

          const processedCssLines = processCssNode(node, context);
          if (!processedCssLines) {
            // if we can't get a processed css we bail
            return;
          }
          const parentNode = findParentNodeForLine(node);
          const globalFontSize = getFontSizeValueInScope(processedCssLines);
          const textForSource = context.getSourceCode().getText(node.quasi);
          const allReplacedValues: string[][] = [];

          const completeSource = processedCssLines.reduce(
            (currentSource, [resolvedCssLine, originalCssLine]) => {
              const [originalProperty, resolvedCssValues] =
                resolvedCssLine.split(':');
              const [_, originalCssValues] = originalCssLine.split(':');
              const propertyName =
                convertHyphenatedNameToCamelCase(originalProperty);
              const isFontFamily = /fontFamily/.test(propertyName);
              const replacedValuesPerProperty: string[] = [originalProperty];

              if (
                !shouldAnalyzeProperty(propertyName, ruleConfig.addons) ||
                !resolvedCssValues ||
                !isValidSpacingValue(resolvedCssValues, globalFontSize)
              ) {
                // in all of these cases no changes should be made to the current property
                return currentSource;
              }

              // gets the values from the associated property, numeric values or NaN
              const processedNumericValues =
                getValueFromShorthand(resolvedCssValues);
              const processedValues = splitShorthandValues(resolvedCssValues);
              // only splits shorthand values but it does not transform NaNs so tokens are preserved
              const originalValues = splitShorthandValues(originalCssValues);

              // reconstructing the string
              // should replace what it can and preserve the raw value for everything else

              const replacementValue = processedNumericValues
                // put together resolved value and original value on a tuple
                .map((value, index) => [
                  // if emToPX conversion fails we'll default to original value
                  emToPixels(value, globalFontSize) || value,
                  processedValues[index],
                  originalValues[index],
                ])
                .map(([numericOrNanValue, pxValue, originalValue]) => {
                  if (isTokenValueString(originalValue)) {
                    // if the value is already valid, nothing to report or replace
                    return originalValue;
                  }
                  if (isNaN(numericOrNanValue) && !isFontFamily) {
                    // this can be either a weird expression or a fontsize declaration

                    // we can't replace a NaN but we can alert what the offending value is
                    context.report({
                      node,
                      messageId: 'noRawSpacingValues',
                      data: {
                        payload: `${propertyName}:${originalValue}`,
                      },
                    });
                    return originalValue;
                  }

                  // value is numeric or fontFamily, and needs replacing we'll report first
                  context.report({
                    node,
                    messageId: 'noRawSpacingValues',
                    data: {
                      payload: `${propertyName}:${numericOrNanValue}`,
                    },
                  });

                  // from here on we know value is numeric or a font family, so it might or might not have a token equivalent
                  const replacementToken = getTokenReplacement(
                    propertyName,
                    numericOrNanValue,
                  );
                  if (!replacementToken) {
                    return originalValue;
                  }

                  replacedValuesPerProperty.push(
                    isFontFamily ? numericOrNanValue.trim() : pxValue,
                  );
                  return replacementToken;
                })
                .join(' ');

              if (replacedValuesPerProperty.length > 1) {
                // first value is the property name, so it will always have at least 1
                allReplacedValues.push(replacedValuesPerProperty);
              }

              // replace property:val with new property:val
              const replacedCssLine: string = currentSource.replace(
                originalCssLine, //  padding: ${gridSize()}px;
                `${originalProperty}: ${replacementValue}`,
              );

              if (!replacedCssLine) {
                return currentSource;
              }

              return replacedCssLine;
            },
            textForSource,
          );

          if (completeSource !== textForSource) {
            // means we found some replacement values, well give the option to fix them

            const replacementComments = `${allReplacedValues
              .map((replacedProperties) => {
                const [propertyName] = replacedProperties;
                const replacedValues = replacedProperties.slice(1).join(' ');
                return `// TODO Delete this comment after verifying spacing token -> previous value \`${propertyName}: ${replacedValues}\``;
              })
              .join('\n')}\n`;

            context.report({
              node,
              messageId: 'autofixesPossible',
              fix: (fixer) => {
                return (
                  !tokenNode && ruleConfig.applyImport
                    ? [insertTokensImport(fixer)]
                    : []
                ).concat([
                  fixer.insertTextBefore(parentNode, replacementComments),
                  fixer.replaceText(node.quasi, completeSource),
                ]);
              },
            });
          }
        },
    };
  },
});

export default rule;
