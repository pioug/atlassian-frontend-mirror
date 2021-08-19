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
  isDecendantOfType,
} from './utils/is-node';

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

const getTokenSuggestion = (
  node: Rule.Node,
  reference: string,
): Rule.SuggestionReportDescriptor[] => [
  {
    desc: `Convert to token with fallback`,
    fix: (fixer) => fixer.replaceText(node, `token('', ${reference})`),
  },
];

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
    },
  },
  create(context) {
    return {
      'TemplateLiteral > Identifier': (node: Rule.Node) => {
        if (node.type === 'Identifier' && isLegacyNamedColor(node.name)) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, node.name),
          });
          return;
        }
      },

      Identifier(node) {
        if (
          !isDecendantOfGlobalToken(node) &&
          !isDecendantOfType(node, 'ImportDeclaration') &&
          isLegacyColor(node.name)
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, node.name),
          });
          return;
        }

        const elevation = isLegacyElevation(node.name);
        if (!isDecendantOfType(node, 'ImportDeclaration') && elevation) {
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

      'ObjectExpression > Property > Literal': (node: Rule.Node) => {
        if (node.type !== 'Literal') {
          return;
        }

        if (typeof node.value !== 'string') {
          return;
        }

        if (
          !isDecendantOfGlobalToken(node) &&
          (isHardCodedColor(node.value) || includesHardCodedColor(node.value))
        ) {
          context.report({
            messageId: 'hardCodedColor',
            node,
            suggest: getTokenSuggestion(node, `'${node.value}'`),
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

      CallExpression(node) {
        if (
          node.type !== 'CallExpression' ||
          node.callee.type !== 'Identifier'
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
          suggest: getTokenSuggestion(node, `${node.callee.name}()`),
        });
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

        const tokenKey = node.arguments[0].value;
        if (
          tokenKey &&
          typeof tokenKey === 'string' &&
          tokenKey in renameMapping
        ) {
          context.report({
            messageId: 'tokenRenamed',
            node,
            data: {
              name: tokenKey + '',
            },
            fix: (fixer) => {
              const newTokenName = renameMapping[tokenKey];
              return fixer.replaceText(node.arguments[0], `'${newTokenName}'`);
            },
          });
          return;
        }

        const anyTokens = tokens as any;
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
