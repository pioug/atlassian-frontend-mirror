import type { Rule } from 'eslint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import tokens from '@atlaskit/tokens/token-names';

import {
  includesHardCodedColor,
  isHardCodedColor,
  isLegacyColor,
  isLegacyNamedColor,
} from './utils/is-color';
import { isLegacyElevation } from './utils/is-elevation';
import {
  isChildOfType,
  isDecendantOfGlobalToken,
  isDecendantOfStyleBlock,
  isDecendantOfStyleJsxAttribute,
  isDecendantOfType,
} from './utils/is-node';
import { isToken } from './utils/is-token';

type PluginConfig = {
  shouldEnforceFallbacks: boolean;
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
          // @ts-ignore JSXAttribute is not available in @types/estree
          node.parent.type === 'JSXAttribute'
            ? `{token('', ${reference})}`
            : `token('', ${reference})`,
        ),
    },
  ].filter(filterSuggestion);

const filterSuggestion = ({ shouldReturnSuggestion }: Suggestion) =>
  shouldReturnSuggestion;

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: true,
    },
    fixable: 'code',
    type: 'problem',
    messages: {
      legacyElevation: `Elevations can be sourced from the global theme using the token function made of both a background and shadow. Use "card" for card elevations, and "overlay" for anything else that should appear elevated.

{{example}}
`,
      directTokenUsage: `Access the global theme using the token function.

\`\`\`
import { token } from '@atlaskit/tokens';

token('{{tokenKey}}');
\`\`\`
`,
      hardCodedColor: `Colors can be sourced from the global theme using the token function.

\`\`\`
import { token } from '@atlaskit/tokens';

token('color.background.blanket');
\`\`\`
`,
      staticToken: `Token string should be inlined directly into the function call.

\`\`\`
token('color.background.blanket');
\`\`\`
`,
      invalidToken: 'The token "{{name}}" does not exist.',
      tokenRenamed: 'The token "{{name}}" has been renamed.',
      tokenFallbackEnforced: `Token function requires a fallback, preferably something that best matches the light/default theme in case tokens aren't present.

\`\`\`
token('color.background.blanket', N500A);
\`\`\`
      `,
      tokenFallbackRestricted: `Token function must not use a fallback.

\`\`\`
token('color.background.blanket');
\`\`\`
      `,
    },
  },
  create(context) {
    const config: PluginConfig = context.options[0] || defaultConfig;

    return {
      'TemplateLiteral > Identifier': (node: Rule.Node) => {
        if (!isDecendantOfStyleBlock(node)) {
          return;
        }

        if (node.type === 'Identifier' && isLegacyNamedColor(node.name)) {
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
          isDecendantOfGlobalToken(node) ||
          isDecendantOfType(node, 'ImportDeclaration')
        ) {
          return;
        }

        if (isLegacyColor(node.name) || isHardCodedColor(node.name)) {
          if (
            node.parent.type === 'MemberExpression' &&
            node.parent.object.type === 'Identifier'
          ) {
            context.report({
              messageId: 'hardCodedColor',
              node,
              suggest: getTokenSuggestion(
                node.parent,
                `${node.parent.object.name}.${node.name}`,
                config,
              ),
            });
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

      'TaggedTemplateExpression[tag.name="css"],TaggedTemplateExpression[tag.object.name="styled"]': (
        node: Rule.Node,
      ) => {
        if (node.type !== 'TaggedTemplateExpression') {
          return;
        }

        const value = node.quasi.quasis.map((q) => q.value.raw).join('');
        const tokenKey = isToken(value, tokens);

        if (tokenKey) {
          context.report({
            messageId: 'directTokenUsage',
            node,
            data: { tokenKey },
          });
          return;
        }

        /**
         * Attempts to remove all non-essential words & characters from a style block.
         * Including selectors, queries and property names, leaving only values
         * This is necessary to avoid cases where a property might have a color in its name ie. "white-space"
         */
        const cssProperties = value
          .replace(/\n/g, '')
          .split(/;|{|}/)
          .filter((el) => !el.match(/\.|\@|\(|\)/))
          .map((el) => el.trim().split(':').pop() || '');

        cssProperties.forEach((property) => {
          if (includesHardCodedColor(property)) {
            context.report({ messageId: 'hardCodedColor', node });
            return;
          }
        });
      },

      'ObjectExpression > Property > Literal': (node: Rule.Node) => {
        if (node.type !== 'Literal') {
          return;
        }

        if (typeof node.value !== 'string') {
          return;
        }

        if (
          !isDecendantOfStyleBlock(node) &&
          !isDecendantOfStyleJsxAttribute(node)
        ) {
          return;
        }

        const tokenKey = isToken(node.value, tokens);
        const isCSSVar = node.value.startsWith('var(');

        if (tokenKey) {
          context.report({
            messageId: 'directTokenUsage',
            node,
            data: { tokenKey },
            fix: (fixer) =>
              isCSSVar ? fixer.replaceText(node, `token('${tokenKey}')`) : null,
          });
          return;
        }

        if (
          isHardCodedColor(node.value) ||
          includesHardCodedColor(node.value)
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
          isDecendantOfGlobalToken(node)
        ) {
          return;
        }

        context.report({
          messageId: 'hardCodedColor',
          node,
          suggest: getTokenSuggestion(node, `${node.callee.name}()`, config),
        });
      },

      'CallExpression[callee.name="token"]': (node: Rule.Node) => {
        if (node.type !== 'CallExpression') {
          return;
        }

        if (
          node.arguments.length < 2 &&
          config.shouldEnforceFallbacks === true
        ) {
          context.report({
            messageId: 'tokenFallbackEnforced',
            node,
          });
        } else if (
          node.arguments.length > 1 &&
          config.shouldEnforceFallbacks === false
        ) {
          if (node.arguments[0].type === 'Literal') {
            const { value } = node.arguments[0];
            context.report({
              messageId: 'tokenFallbackRestricted',
              node: node.arguments[1],
              fix: (fixer: Rule.RuleFixer) =>
                fixer.replaceText(node, `token('${value}')`),
            });
          } else {
            context.report({
              messageId: 'tokenFallbackRestricted',
              node: node.arguments[1],
            });
          }
        }

        if (node.arguments[0] && node.arguments[0].type !== 'Literal') {
          context.report({ messageId: 'staticToken', node });
          return;
        }

        const tokenKey = node.arguments[0].value;

        if (!tokenKey) {
          return;
        }

        if (typeof tokenKey === 'string' && tokenKey in renameMapping) {
          context.report({
            messageId: 'tokenRenamed',
            node,
            data: {
              name: tokenKey,
            },
            fix: (fixer) =>
              fixer.replaceText(
                node.arguments[0],
                `'${renameMapping[tokenKey]}'`,
              ),
          });
          return;
        }

        if (
          typeof tokenKey !== 'string' ||
          (typeof tokenKey === 'string' &&
            !tokens[tokenKey as keyof typeof tokens])
        ) {
          context.report({
            messageId: 'invalidToken',
            node,
            data: {
              name: tokenKey.toString(),
            },
          });
          return;
        }
      },

      JSXAttribute(node: any) {
        if (!node.value) {
          return;
        }

        if (['alt', 'src', 'label'].includes(node.name.name)) {
          return;
        }

        if (
          node.value.type === 'Literal' &&
          (isHardCodedColor(node.value.value) ||
            includesHardCodedColor(node.value.value))
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node.value, node.value.value, config),
          });
          return;
        }
      },
    };
  },
};

export default rule;
