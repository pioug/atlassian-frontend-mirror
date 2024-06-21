import type { Rule } from 'eslint';
import type { JSXAttribute } from 'estree-jsx';

import { createLintRule } from '../utils/create-rule';
import { CSS_IN_JS_IMPORTS, isCxFunction } from '@atlaskit/eslint-utils/is-supported-import';

const IMPORT_SOURCES = [CSS_IN_JS_IMPORTS.compiled, CSS_IN_JS_IMPORTS.atlaskitCss];

function getParentJSXAttribute(node: Rule.Node): JSXAttribute | null {
	let parent: Rule.Node | null = node.parent;

	while (parent && parent.type !== 'JSXAttribute') {
		parent = parent.parent;
	}

	if (parent && parent.type === 'JSXAttribute') {
		return parent;
	}

	return null;
}

export const rule = createLintRule({
	meta: {
		name: 'local-cx-xcss',
		docs: {
			description:
				'Ensures the cx() function, which is part of the XCSS API, is only used within the xcss prop. This aids tracking what styles are applied to a jsx element.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'local-cx-xcss':
				'The cx function should only be declared inside the xcss prop to simplify tracking styles that are applied to a jsx element.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			'CallExpression[callee.name="cx"]': (node: Rule.Node) => {
				if (
					node.type === 'CallExpression' &&
					isCxFunction(node.callee, context.getScope().references, IMPORT_SOURCES)
				) {
					const parentJSXAttribute = getParentJSXAttribute(node);
					const propName = parentJSXAttribute?.name.name.toString();

					if (propName && /[xX]css$/.test(propName)) {
						return;
					}

					context.report({
						node,
						messageId: 'local-cx-xcss',
					});
				}
			},
		};
	},
});

export default rule;
