import type { Rule } from 'eslint';
import type { Property, Node } from 'estree';
import { isCompiledAPI } from '../../util/compiled-utils';

// Checks if node is a call expression with identifier 'token'
const isTokenCallExpression = (node: Node) => {
	if (node.type === 'CallExpression') {
		if (node.callee.type === 'Identifier' && node.callee.name === 'token') {
			return true;
		}
	}
	return false;
};

export const expandBackgroundShorthand: Rule.RuleModule = {
	meta: {
		docs: {
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/compiled/expand-background-shorthand/',
		},
		messages: {
			expandBackgroundShorthand: 'Use backgroundColor instead of background shorthand',
		},
		type: 'problem',
		fixable: 'code',
	},
	create(context) {
		return {
			'Property[key.name="background"]': function (node: Property) {
				if (isCompiledAPI(context, node) && isTokenCallExpression(node.value)) {
					context.report({
						node,
						messageId: 'expandBackgroundShorthand',
						fix(fixer) {
							return fixer.replaceText(node.key, `backgroundColor`);
						},
					});
				}
			},
		};
	},
};

export default expandBackgroundShorthand;
