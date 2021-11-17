import type { Rule } from 'eslint';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import tokens from '@atlaskit/tokens/token-names';

import {
  isDecendantOfStyleBlock,
  isDecendantOfStyleJsxAttribute,
} from '../utils/is-node';
import { isToken } from '../utils/is-token';

type PluginConfig = {
  shouldEnforceFallbacks: boolean;
};

const defaultConfig: PluginConfig = {
  shouldEnforceFallbacks: false,
};

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: true,
    },
    fixable: 'code',
    type: 'problem',
    messages: {
      directTokenUsage: `Access the global theme using the token function.

\`\`\`
import { token } from '@atlaskit/tokens';

token('{{tokenKey}}');
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
    };
  },
};

export default rule;
