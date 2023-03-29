import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getIsException } from '../utils/get-is-exception';
import {
  includesHardCodedColor,
  isHardCodedColor,
  isLegacyColor,
  isLegacyNamedColor,
} from '../utils/is-color';
import { isLegacyElevation } from '../utils/is-elevation';
import {
  isChildOfType,
  isDecendantOfGlobalToken,
  isDecendantOfStyleBlock,
  isDecendantOfStyleJsxAttribute,
  isDecendantOfType,
  isPropertyKey,
  isVariableName,
} from '../utils/is-node';

type PluginConfig = {
  shouldEnforceFallbacks: boolean;
  /**
   * List of exceptions that can be configured for the rule to always ignore.
   */
  exceptions?: string[];
};

const defaultConfig: PluginConfig = {
  shouldEnforceFallbacks: false,
};

const getNodeColumn = (node: Rule.Node) =>
  node.loc ? node.loc.start.column : 0;

type Suggestion = {
  shouldReturnSuggestion: boolean;
} & Rule.SuggestionReportDescriptor;

const getTokenSuggestion = (
  node: Rule.Node,
  reference: string,
  config: PluginConfig,
): Suggestion[] =>
  [
    {
      shouldReturnSuggestion:
        !isDecendantOfGlobalToken(node) &&
        config.shouldEnforceFallbacks === false,
      desc: `Convert to token`,
      fix: (fixer: Rule.RuleFixer) => fixer.replaceText(node, `token('')`),
    },
    {
      shouldReturnSuggestion:
        !isDecendantOfGlobalToken(node) &&
        config.shouldEnforceFallbacks === true,
      desc: `Convert to token with fallback`,
      fix: (fixer: Rule.RuleFixer) =>
        fixer.replaceText(
          node,
          isNodeOfType(node.parent, 'JSXAttribute')
            ? `{token('', ${reference})}`
            : `token('', ${reference})`,
        ),
    },
  ].filter(filterSuggestion);

const filterSuggestion = ({ shouldReturnSuggestion }: Suggestion) =>
  shouldReturnSuggestion;

const rule: Rule.RuleModule = {
  meta: {
    // We need to upgrade the version of ESLint.
    hasSuggestions: true,
    docs: {
      recommended: true,
    },
    fixable: 'code',
    type: 'problem',
    messages: {
      legacyElevation: `Elevations can be sourced from the global theme using the token function made of both a background and shadow. Use "card" for card elevations, and "overlay" for anything else that should appear elevated.

{{example}}
`,
      hardCodedColor: `Colors can be sourced from the global theme using the token function.

\`\`\`
import { token } from '@atlaskit/tokens';

token('color.background.blanket');
\`\`\`
`,
    },
  },
  create(context) {
    const config: PluginConfig = context.options[0] || defaultConfig;

    const isException = getIsException(config.exceptions);

    return {
      'TemplateLiteral > Identifier': (node: Rule.Node) => {
        if (!isDecendantOfStyleBlock(node)) {
          return;
        }

        if (
          node.type === 'Identifier' &&
          isLegacyNamedColor(node.name) &&
          !isException(node)
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, node.name, config),
          });
          return;
        }
      },

      Identifier(node) {
        if (
          isException(node) ||
          isDecendantOfGlobalToken(node) ||
          isDecendantOfType(node, 'SwitchCase') ||
          isDecendantOfType(node, 'ImportDeclaration') ||
          isDecendantOfType(node, 'IfStatement') ||
          isPropertyKey(node) ||
          isVariableName(node)
        ) {
          return;
        }

        const isNodeLegacyColor = isLegacyColor(node.name);
        if (isNodeLegacyColor || isHardCodedColor(node.name)) {
          if (node.parent.type === 'MemberExpression') {
            if (node.parent.object.type === 'Identifier') {
              // Object members as named colors, like obj.ivory, should be valid,
              // and hexes and color functions cannot be property names anyway.
              if (isNodeLegacyColor) {
                context.report({
                  messageId: 'hardCodedColor',
                  node,
                  suggest: getTokenSuggestion(
                    node.parent,
                    `${node.parent.object.name}.${node.name}`,
                    config,
                  ),
                });
              }
            }
            return;
          }

          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, node.name, config),
          });
          return;
        }

        const elevation = isLegacyElevation(node.name);

        if (elevation) {
          context.report({
            messageId: 'legacyElevation',
            node,
            data: {
              example: `\`\`\`
import { token } from '@atlaskit/tokens';

css({
  backgroundColor: token('${elevation.background}');
  boxShadow: token('${elevation.shadow}');
});
\`\`\``,
            },
            fix: (fixer) => {
              if (isChildOfType(node, 'TemplateLiteral') && node.range) {
                return fixer.replaceTextRange(
                  [node.range[0] - 2, node.range[1] + 1],
                  `background-color: \${token('${elevation.background}')};
${' '.repeat(getNodeColumn(node) - 2)}box-shadow: \${token('${
                    elevation.shadow
                  }')}`,
                );
              }

              return null;
            },
          });
        }
      },

      'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"]':
        (node: Rule.Node) => {
          if (node.type !== 'TaggedTemplateExpression') {
            return;
          }

          const value = node.quasi.quasis.map((q) => q.value.raw).join('');

          /**
           * Attempts to remove all non-essential words & characters from a style block.
           * Including selectors, queries and property names, leaving only values
           * This is necessary to avoid cases where a property might have a color in its name ie. "white-space"
           */
          const cssProperties = value
            .replace(/\n/g, '')
            .split(/;|{|}/)
            .map((el) => el.trim().split(':').pop() || '');

          cssProperties.forEach((property) => {
            if (includesHardCodedColor(property)) {
              context.report({ messageId: 'hardCodedColor', node });
              return;
            }
          });
        },

      'ObjectExpression > Property > Literal': (node: Rule.Node) => {
        if (node.type !== 'Literal' || typeof node.value !== 'string') {
          return;
        }

        if (
          !isDecendantOfStyleBlock(node) &&
          !isDecendantOfStyleJsxAttribute(node)
        ) {
          return;
        }

        if (
          (isHardCodedColor(node.value) ||
            includesHardCodedColor(node.value)) &&
          !isException(node)
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, `'${node.value}'`, config),
          });
          return;
        }
      },

      CallExpression(node) {
        if (
          node.type !== 'CallExpression' ||
          node.callee.type !== 'Identifier'
        ) {
          return;
        }

        if (
          !isDecendantOfStyleBlock(node) &&
          !isDecendantOfStyleJsxAttribute(node)
        ) {
          return;
        }

        if (
          !isLegacyNamedColor(node.callee.name) ||
          isDecendantOfGlobalToken(node) ||
          isException(node)
        ) {
          return;
        }

        context.report({
          messageId: 'hardCodedColor',
          node,
          suggest: getTokenSuggestion(node, `${node.callee.name}()`, config),
        });
      },

      JSXAttribute(node: any) {
        if (!node.value) {
          return;
        }

        if (['alt', 'src', 'label'].includes(node.name.name)) {
          return;
        }

        if (node.value.type === 'Literal') {
          if (isException(node)) {
            return;
          }
          const literalValue = node.value.value;
          if (
            isHardCodedColor(literalValue) ||
            includesHardCodedColor(literalValue)
          ) {
            context.report({
              messageId: 'hardCodedColor',
              node,
              suggest: getTokenSuggestion(node.value, literalValue, config),
            });
            return;
          }
        }
      },
    };
  },
};

export default rule;
