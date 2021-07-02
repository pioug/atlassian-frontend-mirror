import type { Rule } from 'eslint';

import tokens from '@atlaskit/tokens/token-names';

import {
  includesHardCodedColor,
  isHardCodedColor,
  isLegacyColor,
} from './utils/is-color';
import { isLegacyElevation } from './utils/is-elevation';
import { isParentGlobalToken } from './utils/is-node';

const getNodeColumn = (node: Rule.Node) => {
  if (node.loc) {
    return node.loc.start.column;
  }

  return 0;
};

const isTokenValue = (value: string): string | false => {
  const tokenValues = Object.entries(tokens);

  for (let i = 0; i < tokenValues.length; i++) {
    const [tokenKey, tokenValue] = tokenValues[i];
    if (value.includes(tokenValue)) {
      return tokenKey;
    }
  }

  return false;
};

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
    },
  },
  create(context) {
    return {
      Identifier(node) {
        if (!isParentGlobalToken(node) && isLegacyColor(node.name)) {
          context.report({
            messageId: 'hardCodedColor',
            node,
          });
        }

        const elevation = isLegacyElevation(node.name);
        if (elevation) {
          const isParentTemplateLiteral =
            node.parent.type === 'TemplateLiteral';

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
              if (isParentTemplateLiteral && node.range) {
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
        if (includesHardCodedColor(value)) {
          context.report({
            messageId: 'hardCodedColor',
            node,
          });
          return;
        }

        const tokenKey = isTokenValue(value);
        if (tokenKey) {
          context.report({
            messageId: 'directTokenUsage',
            node,
            data: {
              tokenKey,
            },
          });
          return;
        }
      },

      Literal(node) {
        if (typeof node.value !== 'string') {
          return;
        }

        if (
          !isParentGlobalToken(node) &&
          (isHardCodedColor(node.value) || includesHardCodedColor(node.value))
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
          });
          return;
        }

        const tokenKey = isTokenValue(node.value);
        const isCSSVar = node.value.startsWith('var(');
        if (tokenKey) {
          context.report({
            messageId: 'directTokenUsage',
            node,
            data: {
              tokenKey,
            },
            fix: (fixer) => {
              if (!isCSSVar) {
                return null;
              }
              return fixer.replaceText(node, `token('${tokenKey}')`);
            },
          });
          return;
        }
      },

      'CallExpression[callee.name="token"]': (node: Rule.Node) => {
        if (node.type !== 'CallExpression') {
          return;
        }

        if (node.arguments[0] && node.arguments[0].type !== 'Literal') {
          context.report({
            messageId: 'staticToken',
            node,
          });
          return;
        }

        const anyTokens = tokens as any;
        const tokenKey = node.arguments[0].value;
        if (typeof tokenKey !== 'string' || !anyTokens[tokenKey]) {
          context.report({
            messageId: 'invalidToken',
            node,
            data: {
              name: tokenKey + '',
            },
          });
          return;
        }
      },
    };
  },
};

export default rule;
