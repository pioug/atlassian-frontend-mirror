// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { Identifier, isNodeOfType, JSXElement } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import { shouldSuggest } from './utils';

const buttonDocsUrl = 'https://atlassian.design/components/button';
const pressableDocsUrl =
  'https://atlassian.design/components/primitives/pressable/';

const rule = createLintRule({
  meta: {
    name: 'no-html-button-element',
    type: 'suggestion',
    hasSuggestions: false,
    docs: {
      description:
        'Prevent direct usage of HTML button elements and enforce usage of Button and Pressable.',
      recommended: false,
      severity: 'warn',
    },
    messages: {
      noHtmlButtonElement: `This "{{element}}" should be replaced with a Button component. If beyond the capabilities of the Button component, use the Pressable primitive. See ${buttonDocsUrl} and ${pressableDocsUrl} for guidance.`,
    },
  },
  create(context) {
    return {
      // Look for <button> HTML elements
      // Look for styled calls/templates - styled.button(...)
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
            messageId: 'noHtmlButtonElement',
            data: {
              element: node.name.name,
            },
          });
        }
      },
      // styled.button`` | styled2.button`` | styled.button()
      'MemberExpression[object.name="styled"],MemberExpression[object.name="styled2"]':
        (node: Rule.Node) => {
          if (!isNodeOfType(node, 'MemberExpression')) {
            return;
          }

          // styled.button``
          if (isNodeOfType(node.property, 'Identifier')) {
            if (node.property.name === 'button') {
              const styledIdentifier = (node.object as Identifier).name;
              const elementName = node.property.name;

              // Including the `styled.` portion in the message to help makers understand it's not just the `button` element that should be replaced
              const reportName = `${styledIdentifier}.${elementName}`; // styled.button

              context.report({
                node: node,
                messageId: 'noHtmlButtonElement',
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

        // styled('button')`` - We only care about 'button', ignore extending other components
        if (isNodeOfType(node.arguments[0], 'Literal')) {
          const argValue = node.arguments[0].raw;
          if (typeof argValue === 'string') {
            const suggest = argValue.replaceAll(`'`, '') === 'button';

            if (suggest) {
              const styledIdentifier = (node.callee as Identifier).name;
              const elementName = argValue;

              // Including the `styled()` portion in the message to help makers understand it's not just the `button` element that should be replaced
              const reportName = `${styledIdentifier}(${elementName})`; // styled('button')

              context.report({
                node: node,
                messageId: 'noHtmlButtonElement',
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
