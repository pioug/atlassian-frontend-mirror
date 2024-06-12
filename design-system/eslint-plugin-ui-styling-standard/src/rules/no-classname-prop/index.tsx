import { isNodeOfType, type Node } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

export const rule = createLintRule({
	meta: {
		name: 'no-classname-prop',
		docs: {
			description: 'Disallows usage of the `className` prop in JSX',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			'no-classname-prop':
				'Avoid `className` because it invites the use of unsafe global styles and is impossible to determine via local tooling.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			JSXAttribute(node: Node) {
				if (!isNodeOfType(node, 'JSXAttribute')) {
					return;
				}

				if (node.name.name === 'className') {
					context.report({ node, messageId: 'no-classname-prop' });
				}
			},
		};
	},
});

export default rule;
