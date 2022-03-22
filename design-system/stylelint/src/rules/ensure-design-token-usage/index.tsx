import valueParser from 'postcss-value-parser';
import stylelint from 'stylelint';

import { isFunction, isVar } from '../../utils/rules';

export const ruleName = 'design-system/ensure-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  noHardcodedColors:
    'Colors should be sourced from the global theme using design token CSS variables.',
});

const colorFunctionSet = new Set([
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'hwb',
  'lab',
  'lch',
  'color',
  'device-cmyk',
]);
const isColorFunction = (value: string) => colorFunctionSet.has(value);

// <https://www.w3.org/TR/css-color-4/#hex-notation>
const isHexColor = (value: string) =>
  /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);

const isColorNode = (node: valueParser.Node) => {
  switch (node.type) {
    case 'function':
      return isColorFunction(node.value);

    case 'word':
      return isHexColor(node.value);
  }
};

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
        if (isFunction(node) && isVar(node)) {
          return false;
        }

        if (isColorNode(node)) {
          stylelint.utils.report({
            message: messages.noHardcodedColors,
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
