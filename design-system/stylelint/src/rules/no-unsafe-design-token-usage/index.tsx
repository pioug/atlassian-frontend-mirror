import valueParser from 'postcss-value-parser';
import stylelint from 'stylelint';
// eslint-disable-next-line no-duplicate-imports
import type { RuleMessageFunc } from 'stylelint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import { getCSSCustomProperty } from '@atlaskit/tokens/token-ids';
// import tokenNames from '@atlaskit/tokens/token-names';

import { isFunction, isVar, isWord } from '../../utils/rules';
import { isToken } from '../../utils/tokens';

type PluginFlags = {
  shouldEnsureFallbackUsage: boolean;
};

type RuleMessage = {
  invalidToken: RuleMessageFunc;
  tokenRemoved: RuleMessageFunc;
  missingFallback: string;
  hasFallback: string;
};

export const ruleName = 'design-system/no-unsafe-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidToken: name =>
    `The token '${name}' does not exist. You can find the design tokens reference at <https://atlaskit.atlassian.com/packages/design-system/tokens/docs/tokens-reference>.`,
  tokenRemoved: (name, replacement) =>
    `The token '${name}' has been deleted. Please use ${replacement} instead.`,
  missingFallback: 'Token usage is missing a fallback.',
  hasFallback: 'Token usage has a fallback.',
} as RuleMessage);

const isInvalidToken = (node: valueParser.Node): boolean =>
  isWord(node) && node.value.startsWith('--ds-') && !isToken(node);

const isDeletedToken = (node: valueParser.Node): boolean =>
  isWord(node) &&
  node.value.startsWith('--ds-') &&
  renameMapping
    .filter(({ state }) => state === 'deleted')
    .some(token => getCSSCustomProperty(token.path) === node.value);

export default stylelint.createPlugin(
  ruleName,
  (isEnabled, flags = {}, context) => {
    return (root, result) => {
      const validOptions = stylelint.utils.validateOptions(
        result,
        ruleName,
        {
          actual: isEnabled,
          possible: [true, false],
        },
        {
          actual: flags,
          possible: {
            shouldEnsureFallbackUsage: [true, false],
          },
          optional: true,
        },
      );

      if (!validOptions || !isEnabled) {
        return;
      }

      const { shouldEnsureFallbackUsage = false } = flags as PluginFlags;

      root.walkDecls(decl => {
        const parsedValue = valueParser(decl.value);

        parsedValue.walk(node => {
          if (!isFunction(node) || !isVar(node)) {
            return;
          }

          const [head, ...tail] = node.nodes;
          if (!head) {
            return;
          }

          if (isDeletedToken(head)) {
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
                message: messages.tokenRemoved(head.value, replacement),
                node: decl,
                word: node.value,
                result,
                ruleName,
              });
            }
          }

          if (isInvalidToken(head)) {
            return stylelint.utils.report({
              message: messages.invalidToken(head.value),
              node: decl,
              word: node.value,
              result,
              ruleName,
            });
          }

          const isTokenUsage = isToken(head);
          if (!isTokenUsage) {
            return;
          }

          const hasFallback = tail.some(node => !isToken(node));
          const isError = shouldEnsureFallbackUsage !== hasFallback;
          if (isError) {
            const message = shouldEnsureFallbackUsage
              ? messages.missingFallback
              : messages.hasFallback;
            stylelint.utils.report({
              message,
              node: decl,
              word: node.value,
              result,
              ruleName,
            });
          }
        });
      });
    };
  },
);
