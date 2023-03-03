import type { Rule } from 'eslint';

const TEST_RUNNER_IDENTIFIER = 'ffTest' as const;

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: false,
    },
    type: 'problem',
    messages: {
      onlyInlineFeatureFlag:
        'Only pass in feature flag as string literal, please replace {{identifierName}} with its value.',
      onlyInlineTestFunction:
        'Only pass in test functions/cases in an inline manner. Test functions/cases should be passed in directly, instead of as variables. Please replace {{identifierName}} with its own definition.',
      passDownExistingFeatureFlagParam:
        'Existing feature flags need to be passed down as params when calling nested test runner. See examples in the package which declares this function.',
      passDownExistingFeatureFlagArgument:
        'Existing feature flags need to be passed in as argument when calling nested test runner. See examples in the package which declares this function.',
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
                node,
                messageId: 'passDownExistingFeatureFlagParam',
              });
            }

            // Not pass in ff to test runner as 4th argument
            if (!node.arguments[3] || node.arguments[3].type !== 'Identifier') {
              return context.report({
                node,
                messageId: 'passDownExistingFeatureFlagArgument',
              });
            }
            // Pass in the above two, but names don't match
            const paramName = node.parent.params[0].name;
            const arguName = node.arguments[3].name;
            if (paramName !== arguName) {
              return context.report({
                node,
                messageId: 'passDownExistingFeatureFlagNamesMatch',
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
