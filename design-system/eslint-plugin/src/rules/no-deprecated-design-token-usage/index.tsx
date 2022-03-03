import type { Rule } from 'eslint';

import renameMapping from '@atlaskit/tokens/rename-mapping';

const getCleanPathId = (path: string) =>
  path
    .split('.')
    .filter((el) => el !== '[default]')
    .join('.');

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      recommended: true,
    },
    fixable: 'code',
    type: 'problem',
    messages: {
      tokenRenamed:
        'The token "{{name}}" is deprecated in favour of "{{replacement}}".',
    },
  },
  create(context) {
    return {
      'CallExpression[callee.name="token"]': (node: Rule.Node) => {
        if (node.type !== 'CallExpression') {
          return;
        }

        if (node.arguments[0].type !== 'Literal') {
          return;
        }

        const tokenKey = node.arguments[0].value;

        if (!tokenKey) {
          return;
        }

        if (typeof tokenKey !== 'string') {
          return;
        }

        const migrationMeta = renameMapping
          .filter((t) => t.state === 'deprecated')
          .find((t) => getCleanPathId(t.path) === tokenKey);

        if (migrationMeta) {
          const cleanTokenKey = getCleanPathId(migrationMeta.replacement);

          context.report({
            messageId: 'tokenRenamed',
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
      },
    };
  },
};

export default rule;
