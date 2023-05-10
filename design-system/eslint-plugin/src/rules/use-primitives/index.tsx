import { EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import {
  primitiveFixer,
  shouldSuggestBox,
  shouldSuggestInline,
  shouldSuggestStack,
} from './utils';

const boxDocsUrl = 'https://staging.atlassian.design/components/primitives/box';
const inlineDocsUrl =
  'https://staging.atlassian.design/components/primitives/inline';
const stackDocsUrl =
  'https://staging.atlassian.design/components/primitives/stack';

const rule = createLintRule({
  meta: {
    name: 'use-primitives',
    type: 'suggestion',
    fixable: 'code',
    hasSuggestions: true,
    docs: {
      description: 'Encourage the usage of primitives components.',
      recommended: false,
      severity: 'warn',
    },
    messages: {
      preferPrimitivesBox: `This "{{element}}" may be able to be replaced with a "Box". See ${boxDocsUrl} for guidance.`,
      preferPrimitivesInline: `This "{{element}}" may be able to be replaced with an "Inline". See ${inlineDocsUrl} for guidance.`,
      preferPrimitivesStack: `This "{{element}}" may be able to be replaced with a "Stack". See ${stackDocsUrl} for guidance.`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          exclude: {
            type: ['string', 'array'],
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {
      /**
       * Traverse file
       * Look for any JSX opening element and check what it is
       * a) it's already a component
       * b) it's native HTML
       *
       * if b) suggest alternative use of primitives
       */
      JSXOpeningElement(node: EslintNode) {
        if (!isNodeOfType(node, 'JSXOpeningElement')) {
          return;
        }
        if (!isNodeOfType(node.name, 'JSXIdentifier')) {
          return;
        }

        const suggestBox = shouldSuggestBox(
          node?.parent as any,
          // context.getScope(),
        );

        const suggestInline = shouldSuggestInline(node?.parent as any, context);
        const suggestStack = shouldSuggestStack(node?.parent as any, context);

        // const suggestText = shouldSuggestText(
        //   node?.parent as any,
        //   // context.getScope(),
        // );

        if (suggestBox) {
          context.report({
            node: node as any,
            messageId: 'preferPrimitivesBox',
            data: {
              element: node.name.name,
            },
            suggest: [
              {
                desc: `Convert to Box`,
                fix: primitiveFixer(node, 'Box', context),
              },
            ],
          });
        }
        if (suggestInline) {
          context.report({
            node: node as any,
            messageId: 'preferPrimitivesInline',
            data: {
              element: node.name.name,
            },
            suggest: [
              {
                desc: `Convert to Inline`,
                fix: primitiveFixer(node, 'Inline', context),
              },
            ],
          });
        }
        if (suggestStack) {
          context.report({
            node: node as any,
            messageId: 'preferPrimitivesStack',
            data: {
              element: node.name.name,
            },
            suggest: [
              {
                desc: `Convert to Stack`,
                fix: primitiveFixer(node, 'Stack', context),
              },
            ],
          });
        }
      },
    };
  },
});

export default rule;
