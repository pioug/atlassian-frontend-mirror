import { type MemberExpression, type CallExpression } from 'eslint-codemod-utils';
import { isStyled, getImportSources } from '@atlaskit/eslint-utils/is-supported-import';


import { createLintRule } from '../utils/create-rule';

export const rule = createLintRule({
  meta: {
    name: 'no-styled',
    docs: {
      description: 'Disallows usage of the `styled` imports',
      recommended: true,
      severity: 'warn',
    },
    messages: {
      'no-styled': "Avoid usages of styled, eg. styled.div, styled('div'), styled(Component), etc.",
    },
    type: 'problem',
  },
  create(context) {
    return {
      CallExpression: (node: CallExpression) => {
        const references = context.getScope().references;
        const importSources = getImportSources(context);

        if (
          isStyled(node, references, importSources)
        ) {
          context.report({ node, messageId: 'no-styled' });
        }

      },
      MemberExpression: (node: MemberExpression) => {
        const references = context.getScope().references;
        const importSources = getImportSources(context);

        if (
          node.object.type === 'Identifier' &&
          isStyled(node.object, references, importSources)
        ) {
          const parent = context.getAncestors().at(-1);
          if (parent && (parent.type === 'CallExpression' || parent.type === 'MemberExpression')) {
            return;
          }
          context.report({ node, messageId: 'no-styled' });
        }
      },
    };
  },
});

export default rule;
