import valueParser, { Node } from 'postcss-value-parser';
import stylelint from 'stylelint';

import { isColorFunction, isHexColor, isNamedColor } from '../../utils/colors';
import {
  isFunction,
  isSpacingRule,
  isTypographyRule,
  isVar,
} from '../../utils/rules';
import { isLengthOrPercentage } from '../../utils/spacing';
import { isToken } from '../../utils/tokens';

const defaultIsEnabled = {
  color: true,
  spacing: false,
  typography: false,
};

export const ruleName = 'design-system/ensure-design-token-usage';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  noHardcodedColors:
    'Colors should be sourced from the global theme using design token CSS variables.',
  noHardcodedSpacing:
    'Spacing values should be sourced from the global theme using design token CSS variables.',
  noHardcodedTypography:
    'Typography values should be sourced from the global theme using design token CSS variables.',
  noNonTokenVars: 'CSS variables should be wrapped in a design token.',
});

const isColorNode = (node: Node) => {
  switch (node.type) {
    case 'function':
      return isColorFunction(node.value);
    case 'word':
      return isHexColor(node.value) || isNamedColor(node.value);
  }
};

export default stylelint.createPlugin(
  ruleName,
  (isEnabled = defaultIsEnabled) => {
    return (root, result) => {
      const validOptions = stylelint.utils.validateOptions(result, ruleName, {
        actual: isEnabled,
        possible: {
          color: [true, false],
          spacing: [true, false],
          typography: [true, false],
        },
      });

      if (!validOptions) {
        return;
      }

      root.walkDecls(decl => {
        valueParser(decl.value).walk(node => {
          if (isEnabled.color) {
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
          }

          if (isEnabled.spacing) {
            // Rule is gap, margin, padding, etc
            if (isSpacingRule(decl.prop)) {
              if (isFunction(node) && isVar(node)) {
                // A valid token was used, exit
                if (isToken(node.nodes[0])) {
                  return false;
                }

                // A variable that isn't a token was used in a spacing rule
                stylelint.utils.report({
                  message: messages.noHardcodedSpacing,
                  node: decl,
                  word: node.value,
                  result,
                  ruleName,
                });

                return false;
              }

              /**
               * Report on px, cm, in, etc
               * This is necessary because we walk multiple types of nodes.
               * So we need to first check whether it's a value that's a length
               * or percentage so we don't report on other types of nodes like
               * 'prop'.
               */
              if (isLengthOrPercentage(node.value)) {
                stylelint.utils.report({
                  message: messages.noHardcodedSpacing,
                  node: decl,
                  word: node.value,
                  result,
                  ruleName,
                });

                return false;
              }
            }
          }

          if (isEnabled.typography) {
            // Rule is font-size, line-height, etc
            if (isTypographyRule(decl.prop)) {
              if (isFunction(node) && isVar(node)) {
                // A valid token was used, exit
                if (isToken(node.nodes[0])) {
                  return false;
                }

                // A variable that isn't a token was used in a spacing rule
                stylelint.utils.report({
                  message: messages.noHardcodedTypography,
                  node: decl,
                  word: node.value,
                  result,
                  ruleName,
                });

                return false;
              }

              /**
               * Report on px, cm, in, etc
               * This is necessary because we walk multiple types of nodes.
               * So we need to first check whether it's a value that's a length
               * or percentage so we don't report on other types of nodes like
               * 'prop'.
               */
              if (isLengthOrPercentage(node.value)) {
                stylelint.utils.report({
                  message: messages.noHardcodedTypography,
                  node: decl,
                  word: node.value,
                  result,
                  ruleName,
                });

                return false;
              }
            }
          }
        });
      });
    };
  },
);
