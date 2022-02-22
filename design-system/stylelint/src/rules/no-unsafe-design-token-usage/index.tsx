import valueParser from 'postcss-value-parser';
import stylelint from 'stylelint';

import renameMapper from '@atlaskit/tokens/rename-mapping';
import tokenNames from '@atlaskit/tokens/token-names';

type PluginFlags = {
  shouldEnsureFallbackUsage: boolean;
};

export const ruleName = 'design-system/no-unsafe-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidToken: (name: string) =>
    `The token '${name}' does not exist. You can find the design tokens reference at <https://atlaskit.atlassian.com/packages/design-system/tokens/docs/tokens-reference>.`,
  missingFallback: 'Token usage is missing a fallback.',
  hasFallback: 'Token usage has a fallback.',
});

const isFunction = (node: valueParser.Node): node is valueParser.FunctionNode =>
  node.type === 'function';

const isWord = (node: valueParser.Node): node is valueParser.WordNode =>
  node.type === 'word';

const tokenSet = new Set<string>(Object.values(tokenNames));
const isToken = (node: valueParser.Node): boolean =>
  isWord(node) && tokenSet.has(node.value);

const isInvalidToken = (node: valueParser.Node): boolean =>
  isWord(node) && node.value.startsWith('--ds-') && !isToken(node);

const deletedTokenValues = Object.entries(tokenNames).filter(([key, value]) =>
  renameMapper
    .filter(({ state }) => state === 'deleted')
    .find(({ path }) => path === key),
);

const isDeletedToken = (node: valueParser.Node): boolean =>
  isWord(node) &&
  node.value.startsWith('--ds-') &&
  deletedTokenValues.findIndex(([_, value]) => node.value === value) >= 0;

export default stylelint.createPlugin(ruleName, (isEnabled, flags = {}) => {
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
        if (!isFunction(node) || node.value !== 'var') {
          return;
        }

        const [head, ...tail] = node.nodes;
        if (!head) {
          return;
        }
        if (isInvalidToken(head) || isDeletedToken(head)) {
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
});
