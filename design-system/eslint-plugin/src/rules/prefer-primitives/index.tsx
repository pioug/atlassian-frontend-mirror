import type { Rule } from 'eslint';
import { Identifier, isNodeOfType, JSXElement } from 'eslint-codemod-utils';

import { validPrimitiveElements } from '../use-primitives/utils';
import { createLintRule } from '../utils/create-rule';

import { shouldSuggest } from './utils';

const primitiveDocsUrl = 'https://go.atlassian.com/dst-prefer-primitives';

const rule = createLintRule({
  meta: {
    name: 'prefer-primitives',
    type: 'suggestion',
    hasSuggestions: false,
    docs: {
      description:
        'Increase awareness of primitive components via code hints. Strictly used for education purposes and discoverability. To enforce usage please refer to the `use-primitives` rule.',
      recommended: false,
      severity: 'warn',
    },
    messages: {
      preferPrimitives: `This "{{element}}" may be able to be replaced with a primitive component. See ${primitiveDocsUrl} for guidance.`,
    },
  },
  create(context) {
    return {
      // Look for HTML elements - <div>, <span>
      // Look for styled calls/templates - styled.div(...), styled.span`...`

      JSXOpeningElement(node: Rule.Node) {
        if (!isNodeOfType(node, 'JSXOpeningElement')) {
          return;
        }
        if (!isNodeOfType(node.name, 'JSXIdentifier')) {
          return;
        }

        const suggest = shouldSuggest(node?.parent as JSXElement);

        if (suggest) {
          context.report({
            node: node,
            messageId: 'preferPrimitives',
            data: {
              element: node.name.name,
            },
          });
        }
      },
      // styled.x`` | styled2.x`` | styled.div()
      'MemberExpression[object.name="styled"],MemberExpression[object.name="styled2"]':
        (node: Rule.Node) => {
          if (!isNodeOfType(node, 'MemberExpression')) {
            return;
          }

          // styled.div``
          if (isNodeOfType(node.property, 'Identifier')) {
            if (validPrimitiveElements.test(node.property.name)) {
              const styledIdentifier = (node.object as Identifier).name;
              const elementName = node.property.name;

              // Including the `styled.` portion in the message to help makers understand it's not just the `div` element that should be replaced
              const reportName = `${styledIdentifier}.${elementName}`; // styled.div

              context.report({
                node: node,
                messageId: 'preferPrimitives',
                data: {
                  element: reportName,
                },
              });
            }
          }
        },
      // styled(X)``
      'CallExpression[callee.name="styled"]': (node: Rule.Node) => {
        if (!isNodeOfType(node, 'CallExpression')) {
          return;
        }

        // styled('div')`` - We only care about 'div'/'span', ignore extending other components
        if (isNodeOfType(node.arguments[0], 'Literal')) {
          const argValue = node.arguments[0].raw;
          if (typeof argValue === 'string') {
            const suggest = validPrimitiveElements.test(
              argValue.replaceAll(`'`, ''), // argValue will have '' around the element name, strip it out for this test
            );

            if (suggest) {
              const styledIdentifier = (node.callee as Identifier).name;
              const elementName = argValue;

              // Including the `styled()` portion in the message to help makers understand it's not just the `div` element that should be replaced
              const reportName = `${styledIdentifier}(${elementName})`; // styled('div')

              context.report({
                node: node,
                messageId: 'preferPrimitives',
                data: {
                  element: reportName,
                },
              });
            }
          }
        }
      },
    };
  },
});

export default rule;
