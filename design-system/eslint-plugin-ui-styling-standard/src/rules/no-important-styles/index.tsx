import estraverse from 'estraverse';

import { createLintRule } from '../utils/create-rule';
import {
  isCss,
  getImportSources,
  isStyled,
  isKeyframes,
  isCssMap,
  isXcss,
} from '@atlaskit/eslint-utils/is-supported-import';
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
    name: 'no-important-styles',
    docs: {
      description: 'Disallows important style declarations',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      'no-important-styles':
        'Important style declarations are disallowed. Refactor so the `!important` flag is not needed.',
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

              if (node.value.type !== 'Literal') {
                return;
              }

              /**
               * There can be whitespace between the `!` and the `important` keyword.
               * There can also be whitespace after the `important` keyword.
               */
              if (node.value.value?.toString().match(/!\s*important\s*$/gm)) {
                context.report({
                  node: node.value,
                  messageId: 'no-important-styles',
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
