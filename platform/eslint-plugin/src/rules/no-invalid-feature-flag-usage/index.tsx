import type { Rule } from 'eslint';

const FF_GETTER_BOOLEAN_IDENTIFIER = 'getBooleanFF' as const;

const __isOnlyOneFlagCheckInExpression = (
  root: Rule.Node,
  ignoredNode: Rule.Node,
): boolean => {
  switch (root.type) {
    case 'IfStatement':
      return __isOnlyOneFlagCheckInExpression(
        root.test as Rule.Node,
        ignoredNode,
      );

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
        __isOnlyOneFlagCheckInExpression(root.left as Rule.Node, ignoredNode) &&
        __isOnlyOneFlagCheckInExpression(root.right as Rule.Node, ignoredNode)
      );

    default:
      return true;
  }
};

const isOnlyOneFlagCheckInExpression = (node: Rule.Node): boolean => {
  let root = node.parent;
  // find the root node of the expression
  while (root.type === 'LogicalExpression') {
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
