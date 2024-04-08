import type { Property } from 'estree';

import {
  isStyled,
  isCss,
  isKeyframes,
  isCssMap,
  isXcss,
  getImportSources,
} from '@atlaskit/eslint-utils/is-supported-import';
import { createLintRule } from '../utils/create-rule';
import { JSONSchema4 } from '@typescript-eslint/utils/dist/json-schema';

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

const getCssSelector = (node: Property): string | null => {
  if (node.key.type === 'Literal' && typeof node.key.value === 'string') {
    return node.key.value;
  }

  if (node.key.type === 'Identifier' && typeof node.key.name === 'string') {
    return node.key.name;
  }

  if (node.key.type === 'TemplateLiteral') {
    return node.key.quasis.map((quasi) => quasi.value.raw).join(' ');
  }

  return null;
};

export const rule = createLintRule({
  meta: {
    name: 'no-nested-selectors',
    docs: {
      description: 'Prevents usage of nested selectors within css styling',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      'no-nested-selectors':
        'Please avoid setting styles for child elements or elements that require context from other elements.',
    },
    type: 'problem',
    schema,
  },
  create(context) {
    const importSources = getImportSources(context);
    return {
      'CallExpression Property': (node: Property): void => {
        const { references } = context.getScope();
        const ancestors = context.getAncestors();

        if (
          ancestors.every(
            (ancestor) =>
              ancestor.type !== 'CallExpression' ||
              !ancestor?.callee ||
              !(
                isCss(ancestor.callee, references, importSources) ||
                isStyled(ancestor.callee, references, importSources) ||
                isKeyframes(ancestor.callee, references, importSources) ||
                isCssMap(ancestor.callee, references, importSources) ||
                isXcss(ancestor.callee, references, importSources)
              ),
          )
        ) {
          return;
        }

        if (node.value.type !== 'ObjectExpression') {
          // If the value is a CSS object, safe to assume we're at a CSS selector
          return;
        }

        const cssSelector = getCssSelector(node);
        if (cssSelector === null) {
          return;
        }

        const tokens = cssSelector.split(/[, ]+/);

        if (
          !tokens.every(
            (token) =>
              token.length === 0 ||
              token.startsWith('&') ||
              token.startsWith(':') ||
              token.includes('+') ||
              token.includes('~') ||
              token.endsWith('&'),
          )
        ) {
          context.report({
            messageId: 'no-nested-selectors',
            node: node.key,
          });
        }
      },
    };
  },
});

export default rule;
