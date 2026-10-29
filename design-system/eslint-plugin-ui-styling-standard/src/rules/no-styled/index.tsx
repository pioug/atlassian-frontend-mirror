import { type CallExpression, type MemberExpression } from 'eslint-codemod-utils';

import { getAncestors, getScope } from '@atlaskit/eslint-utils/context-compat';
import { getImportSources, isStyled } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-styled',
		docs: {
			description: 'Disallows usage of the `styled` imports',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-styled':
				'Replace styled with module-scoped cssMap() or css() from @atlaskit/css and apply styles on the element; pass runtime-only values through style.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			CallExpression: (node: CallExpression) => {
				const references = getScope(context, node).references;
				const importSources = getImportSources(context);

				if (isStyled(node, references, importSources)) {
					context.report({ node, messageId: 'no-styled' });
				}
			},
			MemberExpression: (node: MemberExpression) => {
				const references = getScope(context, node).references;
				const importSources = getImportSources(context);

				if (node.object.type === 'Identifier' && isStyled(node.object, references, importSources)) {
					const parent = getAncestors(context, node).at(-1);
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
