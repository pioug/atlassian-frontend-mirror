import type { Rule } from 'eslint';
import { Identifier, isNodeOfType } from 'eslint-codemod-utils';

import {
  convertHyphenatedNameToCamelCase,
  emToPixels,
  getValue,
  getValueFromShorthand,
  isSpacingProperty,
  isValidSpacingValue,
} from './utils';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'No raw spacing values',
      recommended: true,
    },
    messages: {
      noRawSpacingValues:
        'Prefer the use of spacing primitives over the direct application of spacing properties.\n\n@meta <<{{payload}}>>',
    },
  },
  create(context) {
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
          // @ts-ignore
          fontSizeNode?.type === 'Property' && fontSizeNode.value,
          context,
        );

        const fontSize = Array.isArray(fontSizeValue)
          ? fontSizeValue[0]
          : fontSizeValue;

        parentNode.properties.forEach((node) => {
          if (!isNodeOfType(node, 'Property')) {
            return;
          }

          if (!isNodeOfType(node.key, 'Identifier')) {
            return;
          }

          if (!isSpacingProperty(node.key.name)) {
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

          const value = getValue(node.value, context);

          if (value && isValidSpacingValue(value, fontSize)) {
            const values =
              typeof value === 'number' || typeof value === 'string'
                ? [value]
                : value;

            values.forEach((val) => {
              context.report({
                node,
                messageId: 'noRawSpacingValues',
                data: {
                  payload: `${(node.key as Identifier).name}:${emToPixels(
                    val,
                    fontSize,
                  )}`,
                },
              });
            });
          } else {
            context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `NaN:${value}`,
              },
            });
          }
        });
      },

      // CSSTemplateLiteral and StyledTemplateLiteral
      // const cssTemplateLiteral = css`color: red; padding: 12px`;
      // const styledTemplateLiteral = styled.p`color: red; padding: 8px`;
      'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"]': (
        node: Rule.Node,
      ) => {
        if (node.type !== 'TaggedTemplateExpression') {
          return;
        }

        const combinedString = node.quasi.quasis
          .map((q, i) => {
            return `${q.value.raw}${
              node.quasi.expressions[i]
                ? getValue(node.quasi.expressions[i], context)
                : ''
            }`;
          })
          .join('');
        /**
         * Attempts to remove all non-essential words & characters from a style block.
         * Including selectors and queries
         * Adapted from ensure-design-token-usage
         */
        const cssProperties = combinedString
          .split('\n')
          .filter((line) => !line.trim().startsWith('@'))
          .join('\n')
          .replace(/\n/g, '')
          .split(/;|{|}/)
          .map((el) => el.trim() || '');

        cssProperties.map((style) => {
          let [property, value] = style.split(':');
          property = convertHyphenatedNameToCamelCase(property);

          if (isSpacingProperty(property)) {
            if (isValidSpacingValue(value)) {
              const values = getValueFromShorthand(value);
              for (const val of values) {
                // could be array of values e.g. padding: 8px 12px 3px
                context.report({
                  node,
                  messageId: 'noRawSpacingValues',
                  data: {
                    payload: `${property}:${val}`,
                  },
                });
              }
            } else {
              context.report({
                node,
                messageId: 'noRawSpacingValues',
                data: {
                  payload: `NaN:${value}`,
                },
              });
            }
          }
          return;
        });
      },
    };
  },
};

export default rule;
