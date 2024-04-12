import { isNodeOfType, Node } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import { isBlockedAddEventListener } from './checks/is-blocked-add-event-listener';
import { isBlockedBind } from './checks/is-blocked-bind';
import { isBlockedBindAll } from './checks/is-blocked-bind-all';
import { isBlockedJSXAttribute } from './checks/is-blocked-jsx-attribute';

const rule = createLintRule({
  meta: {
    name: 'no-direct-use-of-web-platform-drag-and-drop',
    type: 'problem',
    docs: {
      recommended: true,
      severity: 'error',
      description:
        'Disallow using direct use of native drag and drop (please use Pragmatic drag and drop)',
    },
    messages: {
      usePragmaticDnd:
        'Please use Pragmatic drag and drop, which makes web platform drag and drop safe and easy to work with.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node: Node) {
        if (!isNodeOfType(node, 'JSXAttribute')) {
          return;
        }

        if (isBlockedJSXAttribute(context, node)) {
          context.report({
            messageId: 'usePragmaticDnd',
            node,
          });
          return;
        }
      },
      CallExpression(node: Node) {
        if (!isNodeOfType(node, 'CallExpression')) {
          return;
        }

        if (
          isBlockedAddEventListener(node) ||
          isBlockedBind(context, node) ||
          isBlockedBindAll(context, node)
        ) {
          context.report({
            messageId: 'usePragmaticDnd',
            node,
          });
          return;
        }
      },
    };
  },
});

export default rule;
