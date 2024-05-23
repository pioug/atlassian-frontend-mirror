// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
  meta: {
    name: 'no-margin',
    type: 'problem',
    docs: {
      recommended: false,
      severity: 'warn',
      description: 'Disallow using the margin CSS property.',
    },
    messages: {
      noMargin:
        'The use of `margin` is considered dangerous as it breaks the component model. Prefer a primitive spacing component or the application of `gap` via CSS Flexbox or Grid to achieve the same result and control the layout from the parent.',
    },
  },

  create(context) {
    return {
      // CSSObjectExpression and StyledObjectExpression
      // const cssObjectExpression = css({ margin: '4px' })
      // const styledObjectExpression = styled.div({margin: '8px'})
      'CallExpression[callee.name=css] > ObjectExpression, CallExpression[callee.object.name=styled] > ObjectExpression':
        (parentNode: Rule.Node) => {
          if (!isNodeOfType(parentNode, 'ObjectExpression')) {
            return;
          }

          const findObjectStyles = (node: EslintNode): void => {
            if (!isNodeOfType(node, 'Property')) {
              return;
            }

            if (isNodeOfType(node.value, 'ObjectExpression')) {
              return node.value.properties.forEach(findObjectStyles);
            }

            if (!isNodeOfType(node.key, 'Identifier')) {
              return;
            }

            if (node.key.name.includes('margin')) {
              context.report({
                node,
                messageId: 'noMargin',
              });
            }

            return;
          };

          parentNode.properties.forEach(findObjectStyles);
        },

      // CSSTemplateLiteral and StyledTemplateLiteral
      // const cssTemplateLiteral = css`color: red; margin: 12px`;
      // const styledTemplateLiteral = styled.p`color: red; margin: 8px`;
      'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"]':
        (node: Rule.Node) => {
          if (node.type !== 'TaggedTemplateExpression') {
            return;
          }

          const combinedString = node.quasi.quasis
            .map((q) => q.value.raw)
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
            .split(/;|(?<!\$){|(?<!\${.+?)}/) // don't split on template literal expressions i.e. `${...}`
            .map((el) => el.trim() || '')
            .filter(Boolean);

          cssProperties.forEach((style) => {
            const prop = style.split(':')[0];

            if (prop.includes('margin')) {
              context.report({
                node,
                messageId: 'noMargin',
              });
            }
          });
        },
    };
  },
});

export default rule;
