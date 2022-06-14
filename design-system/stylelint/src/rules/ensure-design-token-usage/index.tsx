import valueParser from 'postcss-value-parser';
import stylelint from 'stylelint';

import { isColorFunction, isHexColor, isNamedColor } from '../../utils/colors';
import { isFunction, isVar } from '../../utils/rules';
import { isToken } from '../../utils/tokens';

export const ruleName = 'design-system/ensure-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  noHardcodedColors:
    'Colors should be sourced from the global theme using design token CSS variables.',
  noNonTokenVars: 'CSS variables should be wrapped in a design token.',
});

const isColorNode = (node: valueParser.Node) => {
  switch (node.type) {
    case 'function':
      return isColorFunction(node.value);
    case 'word':
      return isHexColor(node.value) || isNamedColor(node.value);
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
      valueParser(decl.value).walk(node => {
        if (isFunction(node) && isVar(node)) {
          if (isToken(node.nodes[0])) {
            return false;
          }

          if (!isToken(node.nodes[0])) {
            /**
             * If we find a var, ensure it's a token var
             */
            stylelint.utils.report({
              message: messages.noNonTokenVars,
              node: decl,
              word: node.value,
              result,
              ruleName,
            });

            return false;
          }
        }

        /**
         * If we find a color function (rgba, hsl) or color (#eee), ensure it's a token
         */
        if (isColorNode(node)) {
          stylelint.utils.report({
            message: messages.noHardcodedColors,
            node: decl,
            word: node.value,
            result,
            ruleName,
          });

          return false;
        }
      });
    });
  };
});
