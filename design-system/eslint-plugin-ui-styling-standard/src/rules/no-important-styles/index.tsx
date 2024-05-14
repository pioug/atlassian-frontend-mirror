import esquery from 'esquery';

import type { Property } from 'estree';

import { createLintRule } from '../utils/create-rule';
import {
  getImportSources,
  hasStyleObjectArguments,
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

        if (!hasStyleObjectArguments(node.callee, references, importSources)) {
          return;
        }

        const matches = esquery(node, 'Property');
        for (const match of matches) {
          if (match.type !== 'Property') {
            return;
          }

          if (isImportant(match.value)) {
            context.report({
              node: match.value,
              messageId: 'no-important-styles',
            });
          }
        }
      },
    };
  },
});

export default rule;

const importantRegex = /!\s*important\s*$/;
function isImportant(node: Property['value']): boolean {
  if (node.type === 'Literal') {
    return typeof node.value === 'string' && importantRegex.test(node.value);
  }

  if (node.type === 'TemplateLiteral') {
    const joinedRaw = node.quasis.map((element) => element.value.raw).join('');
    return importantRegex.test(joinedRaw);
  }

  return false;
}
