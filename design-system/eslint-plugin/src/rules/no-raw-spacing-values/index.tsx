import type { Rule } from 'eslint';
import { Identifier, isNodeOfType } from 'eslint-codemod-utils';

import {
  emToPixels,
  getValue,
  isSpacingProperty,
  removePixelSuffix,
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
         * We do this in case we the fontSize for a style object is declared alongside the `em` or `lineHeight` declaration
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

          const value = getValue(node.value, context);

          if (value) {
            const values =
              typeof value === 'number' || typeof value === 'string'
                ? [value]
                : value;
            values.forEach((value) => {
              context.report({
                node,
                messageId: 'noRawSpacingValues',
                data: {
                  payload: `${(node.key as Identifier).name}:${emToPixels(
                    value,
                    fontSize,
                  )}`,
                },
              });
            });
            return;
          } else {
            context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `${node.key.name}:NaN`,
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
          .replace(/\n/g, '')
          .split(/;|{|}/)
          .map((el) => el.trim() || '');

        cssProperties.map((style) => {
          const [property, value] = style.split(':');

          if (isSpacingProperty(property)) {
            context.report({
              node,
              messageId: 'noRawSpacingValues',
              data: {
                payload: `${property}:${removePixelSuffix(value.trim())}`,
              },
            });
          }
          return;
        });
      },
    };
  },
};

export default rule;
