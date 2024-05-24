import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { StyleProperty } from './transformers';

export const noRawSpacingValues = `Don't use non-token values in padding or margin. There is ongoing work to make this a TypeScript error. Once that happens, you will have to delete/refactor anyway. Atlassians: See https://go.atlassian.com/xcss-spacing for details.`;

const rule = createLintRule({
  meta: {
    name: 'use-latest-xcss-syntax',
    type: 'problem',
    fixable: 'code',
    hasSuggestions: false,
    docs: {
      description:
        'Enforces usage of space design tokens rather than hard-coded values in xcss.',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      noRawSpacingValues,
    },
  },
  create(context) {
    return {
      'CallExpression[callee.name="xcss"] ObjectExpression Property': (
        node: Rule.Node,
      ) => StyleProperty.lint(node, { context }),
    };
  },
});

export default rule;
