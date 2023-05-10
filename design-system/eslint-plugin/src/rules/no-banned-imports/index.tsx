import { EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import { restrictedPaths } from './paths';

const rule = createLintRule({
  meta: {
    name: 'no-banned-imports',
    type: 'problem',
    docs: {
      description: 'Disallow importing banned modules.',
      recommended: true,
      severity: 'error',
    },
    messages: {
      path: "The '{{importSource}}' import is restricted from being used. {{customMessage}}",
    },
  },
  create(context) {
    function checkNode(node: EslintNode) {
      if (
        isNodeOfType(node, 'ExportAllDeclaration') ||
        isNodeOfType(node, 'ExportNamedDeclaration') ||
        isNodeOfType(node, 'ImportDeclaration')
      ) {
        restrictedPaths.find(({ path, message }) => {
          const source = node.source?.value?.toString();
          if (source && (source === path || source.startsWith(path))) {
            context.report({
              node,
              messageId: 'path',
              data: {
                importSource: source,
                customMessage: message,
              },
            });
          }
        });
      }
    }
    return {
      ImportDeclaration: checkNode,
      ExportAllDeclaration: checkNode,
      ExportNamedDeclaration: checkNode,
      ExportDefaultDeclaration: checkNode,
    };
  },
});

export default rule;
