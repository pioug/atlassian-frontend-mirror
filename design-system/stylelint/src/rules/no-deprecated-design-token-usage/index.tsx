import valueParser from 'postcss-value-parser';
import stylelint from 'stylelint';
// eslint-disable-next-line no-duplicate-imports
import type { RuleMessageFunc } from 'stylelint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import { getCSSCustomProperty } from '@atlaskit/tokens/token-ids';

import { isFunction, isWord } from '../../utils/rules';

type RuleMessage = {
  invalidToken: RuleMessageFunc;
};

export const ruleName = 'design-system/no-deprecated-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidToken: (name, replacement) =>
    `The token '${name}' has been deprecated. Please use ${replacement} instead.`,
} as RuleMessage);

const isDeprecatedToken = (node: valueParser.Node): boolean =>
  isWord(node) &&
  node.value.startsWith('--ds-') &&
  renameMapping
    .filter(({ state }) => state === 'deprecated')
    .some(token => getCSSCustomProperty(token.path) === node.value);

export default stylelint.createPlugin(
  ruleName,
  (isEnabled, flags = {}, context) => {
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
            const replacement = getCSSCustomProperty(
              renameMapping.find(
                ({ path }) => getCSSCustomProperty(path) === head.value,
              )!.replacement,
            );

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
        });
      });
    };
  },
);
