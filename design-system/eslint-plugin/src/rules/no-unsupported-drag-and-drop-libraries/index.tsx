import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import { restrictedPaths } from './paths';

const rule = createLintRule({
  meta: {
    name: 'no-unsupported-drag-and-drop-libraries',
    type: 'problem',
    docs: {
      description: 'Disallow importing unsupported drag and drop modules.',
      recommended: true,
      severity: 'error',
    },
    messages: {
      path: "The '{{importSource}}' import is restricted from being used. Please use Pragmatic drag and drop: our performance focused drag and drop library that can be used to power any experience for any techstack. See https://staging.atlassian.design/components/pragmatic-drag-and-drop/. {{customMessage}}",
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
