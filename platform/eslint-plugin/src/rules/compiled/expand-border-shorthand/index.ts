import type { Rule } from 'eslint';
import type { Property, Node, ImportDeclaration, CallExpression } from 'estree';

const EXCLUDED_VALUES = ['0', 'none', 'unset', 'none !important'];

const findCallExpression = (node: Node & { parent?: Node }): CallExpression | null => {
	const parent = node.parent;
	if (!parent) {
		return null;
	}
	if (parent.type === 'CallExpression') {
		return parent;
	}
	return findCallExpression(parent);
};

const separateBorderProperties = (
	borderString: string,
	property: Property,
	context: Rule.RuleContext,
) => {
	if (EXCLUDED_VALUES.includes(borderString)) {
		return;
	}

	context.report({
		node: property,
		messageId: 'expandBorderShorthand',
	});
};

// checks if the function that holds the border property is using an import package that this rule is targeting
const isCompiledAPI = (importDeclaration: ImportDeclaration, callExpression: CallExpression) => {
	let functionName;
	if (callExpression.callee.type === 'Identifier') {
		functionName = callExpression.callee.name;
	} else if (callExpression.callee.type === 'MemberExpression') {
		if (callExpression.callee.object.type === 'Identifier') {
			functionName = callExpression.callee.object.name;
		}
	}
	if (!functionName) {
		return;
	}

	return importDeclaration.specifiers.some(
		(specifier) => specifier.type === 'ImportSpecifier' && specifier.imported.name === functionName,
	);
};

export const expandBorderShorthand: Rule.RuleModule = {
	meta: {
		docs: {
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/compiled/expand-border-shorthand',
		},
		messages: {
			expandBorderShorthand:
				'Use borderColor, borderStyle, and borderWidth instead of border shorthand',
		},
		type: 'problem',
	},
	create(context) {
		let importDeclaration: ImportDeclaration;
		return {
			'ImportDeclaration[source.value="@compiled/react"], ImportDeclaration[source.value="@atlaskit/css"]':
				function (node: ImportDeclaration) {
					importDeclaration = node;
				},
			'Property[key.name="border"]': function (node: Property) {
				const callExpression = findCallExpression(node);
				if (!callExpression) {
					return;
				}
				if (importDeclaration) {
					if (isCompiledAPI(importDeclaration, callExpression)) {
						if (node.value.type === 'Literal' && node.value.value !== null) {
							if (typeof node.value.value === 'string') {
								const borderString = node.value.value;
								separateBorderProperties(borderString, node, context);
							} else if (node.value.raw) {
								const borderString = node.value.raw;
								separateBorderProperties(borderString, node, context);
							}
						} else if (node.value.type === 'TemplateLiteral') {
							if (node.value.quasis.length > 1 || node.value.expressions.length > 0) {
								context.report({
									node,
									messageId: 'expandBorderShorthand',
								});
								return;
							}
							if (node.value.quasis.length === 1 && node.value.quasis[0].value.cooked) {
								const borderQuasis: string = node.value.quasis[0].value.cooked;
								separateBorderProperties(borderQuasis, node, context);
							}
						} else if (node.value.type === 'CallExpression') {
							context.report({
								node,
								messageId: 'expandBorderShorthand',
							});
						}
					}
				}
			},
		};
	},
};

export default expandBorderShorthand;
