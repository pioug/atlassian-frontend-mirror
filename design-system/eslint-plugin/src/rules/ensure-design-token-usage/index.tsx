// @ts-expect-error
import escodegen from 'escodegen-wallaby';
import type { Rule } from 'eslint';
import { isNodeOfType, Property } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';
import { getIsException } from '../utils/get-is-exception';
import {
  includesHardCodedColor,
  isColorCssPropertyName,
  isHardCodedColor,
  isLegacyColor,
  isLegacyNamedColor,
} from '../utils/is-color';
import { isLegacyElevation } from '../utils/is-elevation';
import {
  isChildOfType,
  isDecendantOfGlobalToken,
  isDecendantOfStyleBlock,
  isDecendantOfType,
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

const getNodeColumn = (node: Rule.Node) =>
  node.loc ? node.loc.start.column : 0;

const filterSuggestion = ({ shouldReturnSuggestion }: Suggestion) =>
  shouldReturnSuggestion;

const rule = createLintRule({
  meta: {
    name: 'ensure-design-token-usage',
    hasSuggestions: true,
    docs: {
      description: 'Enforces usage of design tokens.',
      recommended: 'error',
    },
    fixable: 'code',
    type: 'problem',
    messages: {
      legacyElevation: `Elevations can be sourced from the global theme using the token function made of both a background and shadow. Use "card" for card elevations, and "overlay" for anything else that should appear elevated.`,
      hardCodedColor: `Colors can be sourced from the global theme using the token function.`,
    },
  },
  create(context) {
    const config: PluginConfig = context.options[0] || defaultConfig;
    const isException = getIsException(config.exceptions);

    return {
      'TemplateLiteral > Identifier': (node: Rule.Node) => {
        if (node.type !== 'Identifier') {
          return;
        }

        if (isDecendantOfGlobalToken(node) || !isDecendantOfStyleBlock(node)) {
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

        if (
          (isLegacyColor(node.name) || isLegacyNamedColor(node.name)) &&
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

      'ObjectExpression > Property > Identifier, ObjectExpression > Property > MemberExpression':
        (node: Rule.Node) => {
          if (isDecendantOfGlobalToken(node)) {
            return;
          }

          const property = node.parent as Property;
          let propertyKey = '';

          if (property.key.type === 'Identifier') {
            propertyKey = property.key.name.toString();
          }

          if (property.key.type === 'Literal') {
            propertyKey = property.key.value?.toString() || '';
          }

          if (!isColorCssPropertyName(propertyKey)) {
            return;
          }

          if (
            !isDecendantOfStyleBlock(node) &&
            !isDecendantOfType(node, 'JSXExpressionContainer')
          ) {
            return;
          }

          let identifierNode: any;

          if (node.type === 'Identifier') {
            // identifier is the key and not the value
            if (node.name === propertyKey) {
              return;
            }

            identifierNode = node;
          }

          if (node.type === 'MemberExpression') {
            if (node.property.type !== 'Identifier') {
              context.report({
                messageId: 'hardCodedColor',
                node: node,
                suggest: getTokenSuggestion(
                  node,
                  escodegen.generate(node),
                  config,
                ),
              });

              return;
            }

            identifierNode = node.property;
          }

          if (
            (isHardCodedColor(identifierNode.name) ||
              includesHardCodedColor(identifierNode.name) ||
              isLegacyColor(identifierNode.name)) &&
            !isException(identifierNode)
          ) {
            context.report({
              messageId: 'hardCodedColor',
              node: identifierNode,
              suggest: getTokenSuggestion(
                identifierNode,
                identifierNode.name,
                config,
              ),
            });

            return;
          }
        },

      'ObjectExpression > Property > Literal': (node: Rule.Node) => {
        if (node.type !== 'Literal') {
          return;
        }

        if (isDecendantOfGlobalToken(node)) {
          return;
        }

        if (
          !isDecendantOfStyleBlock(node) &&
          !isDecendantOfType(node, 'JSXExpressionContainer')
        ) {
          return;
        }

        const nodeVal = node.value?.toString() || '';

        if (
          (isHardCodedColor(nodeVal) || includesHardCodedColor(nodeVal)) &&
          !isException(node)
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, `'${nodeVal}'`, config),
          });
        }
      },

      'ObjectExpression > Property > CallExpression': (node: Rule.Node) => {
        if (node.type !== 'CallExpression') {
          return;
        }

        if (isDecendantOfGlobalToken(node)) {
          return;
        }

        if (
          !isDecendantOfStyleBlock(node) &&
          !isDecendantOfType(node, 'JSXExpressionContainer')
        ) {
          return;
        }

        if (
          // @ts-expect-error
          !isLegacyNamedColor(node.callee.name) ||
          isException(node)
        ) {
          return;
        }

        context.report({
          messageId: 'hardCodedColor',
          node: node,
          // @ts-expect-error
          suggest: getTokenSuggestion(node, `${node.callee.name}()`, config),
        });
      },

      'JSXAttribute > Literal': (node: Rule.Node) => {
        if (node.type !== 'Literal') {
          return;
        }

        // @ts-expect-error
        if (['alt', 'src', 'label', 'key'].includes(node.parent.name.name)) {
          return;
        }

        if (isException(node.parent)) {
          return;
        }

        if (
          // @ts-expect-error
          isHardCodedColor(node.value) ||
          // @ts-expect-error
          includesHardCodedColor(node.value)
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            // @ts-expect-error
            suggest: getTokenSuggestion(node, node.value, config),
          });
          return;
        }
      },
      'JSXExpressionContainer > MemberExpression': (node: Rule.Node) => {
        if (node.type !== 'MemberExpression') {
          return;
        }

        if (
          // @ts-expect-error
          isLegacyColor(node.property.name) ||
          // @ts-expect-error
          (node.object.name === 'colors' &&
            // @ts-expect-error
            isLegacyNamedColor(node.property.name))
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(
              node,
              // @ts-expect-error
              `${node.object.name}.${node.property.name}`,
              config,
            ),
          });
        }
      },
      'JSXExpressionContainer > Identifier': (node: any) => {
        if (node.type !== 'Identifier') {
          return;
        }

        if (isException(node)) {
          return;
        }

        if (isLegacyColor(node.name) || includesHardCodedColor(node.name)) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, node.name, config),
          });
          return;
        }
      },
    };
  },
});

export default rule;
