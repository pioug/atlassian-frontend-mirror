import { isNodeOfType, type Node } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const isXcssProp = (propName: string): propName is `${string}Xcss` | `xcss` => {
	if (propName === 'xcss') {
		return true;
	}

	return propName.endsWith('Xcss');
};

export const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-classname-prop',
		docs: {
			description: 'Disallows usage of the `className` prop in JSX',
			recommended: true,
			severity: 'error',
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

				if (node.name.name !== 'className' || !node.value) {
					// Ignore, we can't parse this—it either isn't a `className` prop or has no value.
					return;
				}

				if (isNodeOfType(node.value, 'JSXExpressionContainer')) {
					/**
					 * We're basically looking for `className={xcss}` and nothing else…
					 */
					let propValueName: string | null = null;
					if (isNodeOfType(node.value.expression, 'Identifier')) {
						// eg. `className={xcss}`
						propValueName = node.value.expression.name;
					} else if (
						isNodeOfType(node.value.expression, 'MemberExpression') &&
						isNodeOfType(node.value.expression.property, 'Identifier')
					) {
						// eg. `className={props.xcss}`
						propValueName = node.value.expression.property.name;
					} else if (
						isNodeOfType(node.value.expression, 'MemberExpression') &&
						isNodeOfType(node.value.expression.property, 'Literal') &&
						typeof node.value.expression.property.value === 'string'
					) {
						// eg. `className={props['xcss']}`
						propValueName = node.value.expression.property.value;
					}

					if (propValueName && isXcssProp(propValueName)) {
						// Ignore, it's valid to have `className={xcss}`
						// We just assume people have this typed correctly, eg. they're not using `xcss?: any`
						return;
					}
				}

				context.report({ node, messageId: 'no-classname-prop' });
			},
		};
	},
});

export default rule;
