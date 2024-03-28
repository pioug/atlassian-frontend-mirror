import estraverse from 'estraverse';

import { createLintRule } from '../utils/create-rule';
import {
  isCss,
  getImportSources,
  isStyled,
  isKeyframes,
  isCssMap,
  isXcss,
} from '../utils/is-supported-import';
import type { JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';

const schema: JSONSchema4 = [
  {
    type: 'object',
    properties: {
      importSources: {
        type: 'array',
        items: { type: 'string' },
        uniqueItems: true,
      },
    },
  },
];

export const rule = createLintRule({
  meta: {
    name: 'no-container-queries',
    docs: {
      description: 'Prevents usage of @container query within css styling',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      'no-container-queries':
        'We block @container queries as they break scope and are not type-safe. We suggest alternatives such as JS-based APIs or @media queries.',
    },
    type: 'problem',
    schema,
  },
  create(context) {
    const importSources = getImportSources(context);

    return {
      CallExpression(node) {
        const { references } = context.getScope();

        if (
          isCss(node.callee, references, importSources) ||
          isStyled(node.callee, references, importSources) ||
          isKeyframes(node.callee, references, importSources) ||
          isCssMap(node.callee, references, importSources) ||
          isXcss(node.callee, references, importSources)
        ) {
          estraverse.traverse(node, {
            enter(node) {
              if (node.type !== 'Property') {
                return;
              }

              if (
                node.key.type !== 'Literal' &&
                node.key.type !== 'TemplateLiteral'
              ) {
                return;
              }

              if (
                node.key.type === 'Literal' &&
                node.key.value?.toString().match(/@container/)
              ) {
                context.report({
                  node: node.key,
                  messageId: 'no-container-queries',
                });
              }

              if (
                node.key.type === 'TemplateLiteral' &&
                node.key.quasis[0]?.value.raw.match(/@container/)
              ) {
                context.report({
                  node: node.key,
                  messageId: 'no-container-queries',
                });
              }
            },
            /**
             * This is needed to handle unknown node types. Otherwise an error is thrown.
             */
            fallback: 'iteration',
          });
        }
      },
    };
  },
});

export default rule;
