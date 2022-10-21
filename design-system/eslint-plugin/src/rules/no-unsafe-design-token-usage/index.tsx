import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import renameMapping from '@atlaskit/tokens/rename-mapping';
import { getTokenId } from '@atlaskit/tokens/token-ids';
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
      tokenRemoved:
        'The token "{{name}}" is removed in favour of "{{replacement}}".',
      tokenIsExperimental:
        'The token "{{name}}" is experimental and should not be used directly at this time. It should be replaced by "{{replacement}}".',
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
        if (!isNodeOfType(node, 'TaggedTemplateExpression')) {
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
        if (!isNodeOfType(node, 'CallExpression')) {
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

        const deletedMigrationMeta = renameMapping
          .filter((t) => t.state === 'deleted')
          .find((t) => getTokenId(t.path) === tokenKey);

        if (typeof tokenKey === 'string' && deletedMigrationMeta) {
          const cleanTokenKey = getTokenId(deletedMigrationMeta.replacement);

          context.report({
            messageId: 'tokenRemoved',
            node,
            data: {
              name: tokenKey,
              replacement: cleanTokenKey,
            },
            fix: (fixer) =>
              fixer.replaceText(node.arguments[0], `'${cleanTokenKey}'`),
          });
          return;
        }

        const experimentalMigrationMeta = renameMapping
          .filter((t) => t.state === 'experimental')
          .find((t) => getTokenId(t.path) === tokenKey);

        const tokenNames = Object.keys(tokens);

        if (typeof tokenKey === 'string' && experimentalMigrationMeta) {
          const replacementValue = experimentalMigrationMeta.replacement;

          const isReplacementAToken = tokenNames.includes(replacementValue);

          context.report({
            messageId: 'tokenIsExperimental',
            node,
            data: {
              name: tokenKey,
              replacement: replacementValue,
            },
            fix: (fixer) =>
              isReplacementAToken
                ? fixer.replaceText(node.arguments[0], `'${replacementValue}'`)
                : fixer.replaceText(node, `'${replacementValue}'`),
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
