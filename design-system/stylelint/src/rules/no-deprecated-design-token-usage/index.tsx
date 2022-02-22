import valueParser from 'postcss-value-parser';
import stylelint from 'stylelint';

import renameMapper from '@atlaskit/tokens/rename-mapping';
import tokenNames from '@atlaskit/tokens/token-names';

export const ruleName = 'design-system/no-deprecated-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  invalidToken: (name: string, replacement: string) =>
    `The token '${name}' has been deprecated. Please use ${replacement} instead.`,
});

const isFunction = (node: valueParser.Node): node is valueParser.FunctionNode =>
  node.type === 'function';

const isWord = (node: valueParser.Node): node is valueParser.WordNode =>
  node.type === 'word';

const deprecatedTokenValues = Object.entries(
  tokenNames,
).filter(([key, value]) =>
  renameMapper
    .filter(({ state }) => state === 'deprecated')
    .find(({ path }) => path === key),
);

type typeTokens = keyof typeof tokenNames;

const deprecatedTokenReplacementMap = renameMapper
  .filter(({ state }) => state === 'deprecated')
  .map(({ path, state, replacement }) => ({
    path,
    pathValue: tokenNames[path as typeTokens],
    state,
    replacement,
    replacementValue:
      tokenNames[replacement.replace('.[default]', '') as typeTokens],
  }));

const isDeprecatedToken = (node: valueParser.Node): boolean =>
  isWord(node) &&
  node.value.startsWith('--ds-') &&
  deprecatedTokenValues.findIndex(([_, value]) => node.value === value) >= 0;

export default stylelint.createPlugin(ruleName, isEnabled => {
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
          return stylelint.utils.report({
            message: messages.invalidToken(
              head.value,
              deprecatedTokenReplacementMap.find(
                ({ pathValue }) => head.value === pathValue,
              )!.replacementValue,
            ),
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
