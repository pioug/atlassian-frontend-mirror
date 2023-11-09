// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const TEST_RUNNER_IDENTIFIER = 'ffTest' as const;

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: false,
    },
    type: 'problem',
    fixable: 'code',
    messages: {
      onlyInlineFeatureFlag:
        'Only pass in feature flag as string literal, please replace {{identifierName}} with its value.',
      onlyInlineTestFunction:
        'Only pass in test functions/cases in an inline manner. Test functions/cases should be passed in directly, instead of as variables. Please replace {{identifierName}} with its own definition.',
      passDownExistingFeatureFlagParam:
        'An argument symbolising existing FFs needs to be passed down as param when calling nested test runner. See examples in the package which declares this function.',
      passDownExistingFeatureFlagArgument:
        'An argument symbolising existing FFs needs to be passed in as argument when calling nested test runner. See examples in the package which declares this function.',
      passDownExistingFeatureFlagNamesMatch:
        'Argument names not matching when passing down existing feature flags. See examples in the package which declares this function.',
    },
  },
  create(context) {
    return {
      [`CallExpression[callee.name=/${TEST_RUNNER_IDENTIFIER}/]`]: (
        node: Rule.Node,
      ) => {
        if (node.type === 'CallExpression') {
          const args = node.arguments;

          // Verify FF is passed inline
          if (args[0] && args[0].type !== 'Literal') {
            return context.report({
              node,
              messageId: 'onlyInlineFeatureFlag',
              data: {
                identifierName:
                  args[0].type === 'Identifier' ? args[0].name : '',
              },
            });
          }

          // Verify test functions/cases are passed inline
          if (args[1] && args[1].type !== 'ArrowFunctionExpression') {
            return context.report({
              node,
              messageId: 'onlyInlineTestFunction',
              data: {
                identifierName:
                  args[1].type === 'Identifier' ? args[1].name : '',
              },
            });
          }

          if (args[2] && args[2].type !== 'ArrowFunctionExpression') {
            return context.report({
              node,
              messageId: 'onlyInlineTestFunction',
              data: {
                identifierName:
                  args[2].type === 'Identifier' ? args[2].name : '',
              },
            });
          }

          // Verify existing ff overrides are passed down if test runner is nested
          let upperTestRunner = node.parent?.parent;
          if (
            upperTestRunner?.type === 'CallExpression' &&
            upperTestRunner?.callee.type === 'Identifier' &&
            upperTestRunner?.callee.name === TEST_RUNNER_IDENTIFIER &&
            node.parent?.type === 'ArrowFunctionExpression'
          ) {
            // Not pass in ff to the function that calls test runner
            if (
              !node.parent.params[0] ||
              node.parent.params[0].type !== 'Identifier'
            ) {
              return context.report({
                node: node.parent,
                messageId: 'passDownExistingFeatureFlagParam',
                fix: function (fixer) {
                  const parentNodeRange = node.parent.range as [number, number];
                  return [
                    fixer.replaceTextRange(
                      [parentNodeRange[0], parentNodeRange[0] + 2],
                      'ff',
                    ),
                    node.arguments[3]
                      ? fixer.replaceText(node.arguments[3], 'ff')
                      : fixer.insertTextAfter(node.arguments[2], ', ff'),
                  ];
                },
              });
            }

            // Not pass in ff to test runner as 4th argument
            const paramName = node.parent.params[0].name;
            if (!node.arguments[3] || node.arguments[3].type !== 'Identifier') {
              return context.report({
                node,
                messageId: 'passDownExistingFeatureFlagArgument',
                fix: function (fixer) {
                  return node.arguments[3]
                    ? fixer.replaceText(node.arguments[3], paramName)
                    : fixer.insertTextAfter(
                        node.arguments[2],
                        `, ${paramName}`,
                      );
                },
              });
            }
            // Pass in the above two, but names don't match
            const arguName = node.arguments[3].name;
            if (paramName !== arguName) {
              return context.report({
                node: node.parent,
                messageId: 'passDownExistingFeatureFlagNamesMatch',
                fix: function (fixer) {
                  return fixer.replaceText(node.arguments[3], paramName);
                },
              });
            }
          }
        }
        return {};
      },
    };
  },
};

export default rule;
