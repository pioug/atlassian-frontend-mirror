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
import {
  isDecendantOfGlobalToken,
  isDecendantOfStyleBlock,
  isDecendantOfType,
} from '../utils/is-node';

import {
  convertHyphenatedNameToCamelCase,
  emToPixels,
  findParentNodeForLine,
  findTokenNameByPropertyValue,
  getFontSizeFromNode,
  getFontSizeValueInScope,
  getRawExpression,
  getTokenNodeForValue,
  getTokenReplacement,
  getValue,
  getValueFromShorthand,
  insertTokensImport,
  isAuto,
  isCalc,
  isTokenValueString,
  isValidSpacingValue,
  isZero,
  processCssNode,
  replacementComment,
  shouldAnalyzeProperty,
  splitShorthandValues,
} from './utils';

type Addon = 'spacing' | 'typography' | 'shape';
type RuleConfig = {
  addons: Addon[];
  applyImport?: boolean;
};

const rule = createRule<
  [RuleConfig],
  'noRawSpacingValues' | 'autofixesPossible' | 'noRawRadiusValues'
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
      noRawRadiusValues:
        'The use of shape tokens is preferred over the direct application of border properties.\n\n@meta <<{{payload}}>>',
      noRawSpacingValues:
        'The use of spacing primitives or tokens is preferred over the direct application of spacing properties.\n\n@meta <<{{payload}}>>',
      autofixesPossible:
        'Automated corrections available for spacing values. Apply autofix to replace values with appropriate tokens',
    },
  },
  // @ts-expect-error types associated with createRule clash with eslint-codemod-utils :(
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
      ObjectExpression: (parentNode: Rule.Node) => {
        if (!isNodeOfType(parentNode, 'ObjectExpression')) {
          return;
        }

        // Return for nested objects - these get handled automatically so without returning we'd be doubling up
        if (parentNode.parent.type === 'Property') {
          return;
        }

        if (
          !isDecendantOfStyleBlock(parentNode) &&
          !isDecendantOfType(parentNode, 'JSXExpressionContainer')
        ) {
          return;
        }

        /**
         * We do this in case the fontSize for a style object is declared alongside the `em` or `lineHeight` declaration
         */
        const fontSize = getFontSizeFromNode(parentNode, context);

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
            isNodeOfType(node.value, 'Literal') &&
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

          // Don't report on CSS calc function
          if (isNodeOfType(node.value, 'Literal') && isCalc(node.value.value)) {
            return;
          }

          const propertyName = (node.key as Identifier).name;
          const isFontFamily = /fontFamily/.test(propertyName);

          const value = getValue(node.value, context);

          // value is either NaN or it can't be resolved (e.g. em, 100% etc...)
          if (!(value && isValidSpacingValue(value, fontSize))) {
            return context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `NaN:${value}`,
              },
            });
          }

          // The corresponding values for a single CSS property (e.g. padding: '8px 16px 2px' => [8, 16, 2])
          const valuesForProperty = Array.isArray(value) ? value : [value];

          // value is a single value so we can apply a more robust approach to our fix
          // treat fontFamily as having one value
          if (valuesForProperty.length === 1 || isFontFamily) {
            const [value] = valuesForProperty;

            // Do not report or suggest a token to replace 0 or auto
            if (isZero(value) || isAuto(value)) {
              return;
            }

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

                const replacementNode = getTokenReplacement(
                  propertyName,
                  pixelValue,
                );

                if (!replacementNode) {
                  return null;
                }

                return (
                  !tokenNode && ruleConfig.applyImport
                    ? [insertTokensImport(fixer)]
                    : []
                ).concat([
                  fixer.insertTextBefore(
                    node,
                    `${replacementComment} \`${nodeFn(
                      node.value,
                    )}\`\n${' '.padStart(node.loc?.start.column || 0)}`,
                  ),
                  fixer.replaceText(
                    node,
                    property({
                      ...node,
                      value: replacementNode,
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
           * { padding: '8px 0px' }
           */
          valuesForProperty.forEach((val) => {
            const pixelValue = emToPixels(val, fontSize);

            // Do not report or suggest a token to replace 0 or auto
            if (isZero(val) || isAuto(val)) {
              return;
            }

            context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `${propertyName}:${pixelValue}`,
              },
              fix: (fixer) => {
                const allResolvableValues = valuesForProperty.every(
                  (value) => !Number.isNaN(emToPixels(value, fontSize)),
                );
                if (!allResolvableValues) {
                  return null;
                }

                const valuesWithTokenReplacement = valuesForProperty
                  .filter((value) =>
                    findTokenNameByPropertyValue(propertyName, value),
                  )
                  .filter((value) => value !== 0);

                if (valuesWithTokenReplacement.length === 0) {
                  // all values could be replaceable but that just means they're numeric
                  // if none of the values have token replacement we bail
                  return null;
                }

                const originalCssString = getRawExpression(node.value, context);
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
                if (originalValues.length !== valuesForProperty.length) {
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
                    `\`${valuesForProperty
                      .map((value, index) => {
                        if (isZero(value)) {
                          return originalValues[index];
                        }
                        const pixelValue = emToPixels(value, fontSize);
                        const pixelValueString = `${pixelValue}px`;
                        // if there is a token we take it, otherwise we go with the original value

                        return findTokenNameByPropertyValue(propertyName, value)
                          ? `\${${getTokenNodeForValue(
                              propertyName,
                              pixelValueString,
                            )}}`
                          : originalValues[index];
                      })
                      .join(' ')}\``,
                  ),
                ]);
              },
            });
          });
        }

        parentNode.properties.forEach(findObjectStyles);
      },

      // CSSTemplateLiteral and StyledTemplateLiteral
      // const cssTemplateLiteral = css`color: red; padding: 12px`;
      // const styledTemplateLiteral = styled.p`color: red; padding: 8px`;
      'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"],TaggedTemplateExpression[tag.callee.name="styled"]':
        (node: Rule.Node) => {
          if (!isNodeOfType(node, 'TaggedTemplateExpression')) {
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

                  // do not replace 0 or auto with tokens
                  if (isZero(pxValue) || isAuto(pxValue)) {
                    return originalValue;
                  }

                  if (isNaN(numericOrNanValue) && !isFontFamily) {
                    // do not report if we have nothing to replace with
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
                  const replacementNode = getTokenReplacement(
                    propertyName,
                    numericOrNanValue,
                  );

                  if (!replacementNode) {
                    return originalValue;
                  }

                  const replacementToken =
                    '${' + replacementNode.toString() + '}';

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
            // means we found some replacement values, we'll give the option to fix them

            const replacementComments = `${allReplacedValues
              .map((replacedProperties) => {
                const [propertyName] = replacedProperties;
                const replacedValues = replacedProperties.slice(1).join(' ');
                return `${replacementComment} \`${propertyName}: ${replacedValues}\``;
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
