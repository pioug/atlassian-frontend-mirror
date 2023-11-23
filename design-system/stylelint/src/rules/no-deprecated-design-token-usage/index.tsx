import valueParser from 'postcss-value-parser';
import stylelint, { Rule, RuleBase, RuleMessageFunc } from 'stylelint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import { getCSSCustomProperty } from '@atlaskit/tokens/token-ids';

import { isFunction, isWord } from '../../utils/rules';

type RuleMessage = {
  invalidToken: RuleMessageFunc;
  deprecatedToken: RuleMessageFunc;
};

export const ruleName = 'design-system/no-deprecated-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidToken: (name, replacement) =>
    `The token '${name}' has been deprecated. Please use ${replacement} instead.`,
  deprecatedToken: name =>
    `The token '${name}' is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/tokens/changelog`,
} as RuleMessage);

const isDeprecatedToken = (node: valueParser.Node): boolean =>
  isWord(node) &&
  node.value.startsWith('--ds-') &&
  renameMapping
    .filter(({ state }) => state === 'deprecated')
    .some(token => getCSSCustomProperty(token.path) === node.value);

const ruleBase: RuleBase = (isEnabled, flags = {}, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: isEnabled,
      possible: [true, false],
    });
    if (!validOptions || !isEnabled) {
      return;
    }

    root.walkDecls(decl => {
      const parsedValue = valueParser(decl.value);

      parsedValue.walk(node => {
        if (!isFunction(node) || node.value !== 'var') {
          return;
        }

        const [head] = node.nodes;
        if (!head) {
          return;
        }

        if (isDeprecatedToken(head)) {
          const tokenMeta = renameMapping.find(
            ({ path }) => getCSSCustomProperty(path) === head.value,
          );

          if (!tokenMeta) {
            return;
          }

          if (tokenMeta.replacement) {
            const replacement = getCSSCustomProperty(tokenMeta.replacement);

            if (context.fix) {
              decl.value = decl.value.replace(head.value, replacement);
              return;
            } else {
              return stylelint.utils.report({
                message: messages.invalidToken(head.value, replacement),
                node: decl,
                word: node.value,
                result,
                ruleName,
              });
            }
          }

          // No replacement specified
          return stylelint.utils.report({
            message: messages.deprecatedToken(head.value),
            node: decl,
            word: node.value,
            result,
            ruleName,
          });
        }
      });
    });
  };
};

const rule: Rule<any, any> = Object.assign(ruleBase, {
  ruleName: ruleName,
  messages: messages,
});

export default stylelint.createPlugin(ruleName, rule);
