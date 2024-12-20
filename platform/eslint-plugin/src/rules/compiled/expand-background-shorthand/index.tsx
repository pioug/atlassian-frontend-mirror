import type { Rule } from 'eslint';
import type { Property, Node } from 'estree';
import {
	getImportSources,
	isCompiled,
	isAtlasKitCSS,
} from '@atlaskit/eslint-utils/is-supported-import';
import { getAncestors, getScope } from '../../util/context-compat';

// Checks if the function that holds the border property is using an import package that this rule is targeting
const isCompiledAPI = (context: Rule.RuleContext, node: Node): boolean => {
	const importSources = getImportSources(context);
	const { references } = getScope(context, node);
	const ancestors = getAncestors(context, node);
	if (
		ancestors.some(
			(ancestor) =>
				ancestor.type === 'CallExpression' &&
				ancestor.callee &&
				(isCompiled(ancestor.callee, references, importSources) ||
					isAtlasKitCSS(ancestor.callee, references, importSources)),
		)
	) {
		return true;
	}
	return false;
};

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
