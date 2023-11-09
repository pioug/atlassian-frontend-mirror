// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { Node, Expression } from 'estree';

const FF_GETTER_BOOLEAN_IDENTIFIER = 'getBooleanFF' as const;

const __isOnlyOneFlagCheckInExpression = (
  root: Node | Expression,
  ignoredNode: Node,
): boolean => {
  switch (root.type) {
    case 'IfStatement':
      return __isOnlyOneFlagCheckInExpression(root.test, ignoredNode);
    case 'UnaryExpression':
      return __isOnlyOneFlagCheckInExpression(root.argument, ignoredNode);

    case 'CallExpression':
      if (root === ignoredNode) {
        return true;
      }
      return !(
        root.callee.type === 'Identifier' &&
        root.callee.name === FF_GETTER_BOOLEAN_IDENTIFIER
      );

    // shouldn't ever get here but just in case
    case 'Identifier':
      return root.name !== FF_GETTER_BOOLEAN_IDENTIFIER;

    case 'BinaryExpression':
    case 'LogicalExpression':
      return (
        __isOnlyOneFlagCheckInExpression(root.left, ignoredNode) &&
        __isOnlyOneFlagCheckInExpression(root.right, ignoredNode)
      );

    default:
      return true;
  }
};

const isOnlyOneFlagCheckInExpression = (node: Rule.Node): boolean => {
  let root = node.parent;
  // find the root node of the expression
  // NOTE: This is not an exhaustive check for all ESTree.Expression types but is good enough
  while (root.type.endsWith('Expression')) {
    root = root.parent;
  }

  return __isOnlyOneFlagCheckInExpression(root, node);
};

const rule: Rule.RuleModule = {
  meta: {
    hasSuggestions: false,
    docs: {
      recommended: false,
    },
    type: 'problem',
    messages: {
      onlyInlineIf:
        "Only call feature flags as part of an expression, don't assign to a variable! See http://go/pff-eslint for more details",
      onlyStringLiteral:
        "Only get feature flags by string literal, don't use variables! See http://go/pff-eslint for more details",
      multipleFlagCheckInExpression: `Only check one flag per expression! See http://go/pff-eslint for more details`,
    },
  },
  create(context) {
    return {
      [`CallExpression[callee.name=/${FF_GETTER_BOOLEAN_IDENTIFIER}/]`]: (
        node: Rule.Node,
      ) => {
        // to make typescript happy
        if (node.type === 'CallExpression') {
          const args = node.arguments;

          if (args.length === 1 && args[0].type !== 'Literal') {
            return context.report({
              node,
              messageId: 'onlyStringLiteral',
            });
          }

          switch (node.parent?.type) {
            case 'IfStatement':
            case 'ConditionalExpression':
              break;
            case 'UnaryExpression':
            case 'LogicalExpression':
              if (!isOnlyOneFlagCheckInExpression(node)) {
                context.report({
                  node,
                  messageId: 'multipleFlagCheckInExpression',
                });
              }
              break;
            default:
              return context.report({
                node,
                messageId: 'onlyInlineIf',
              });
          }
        }

        return {};
      },
    };
  },
};

export default rule;
