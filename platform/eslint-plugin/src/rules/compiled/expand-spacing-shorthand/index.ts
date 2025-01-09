import type { Rule } from 'eslint';
import type { Property, Node, TemplateLiteral, CallExpression } from 'estree';
import { getSourceCode } from '../../util/context-compat';
import { isCompiledAPI } from '../../util/compiled-utils';

const spacingPos = ['Top', 'Right', 'Bottom', 'Left'] as const;

interface ExpandSpacingPropertiesType {
	context: Rule.RuleContext;
	node: Property & { parent?: Node };
	propertyValues: string[];
	fixer: Rule.RuleFixer;
	propertyShorthand: string;
}

// Checks if node is a call expression with identifier 'token'
const isTokenCallExpression = (node: CallExpression) => {
	if (node.callee.type === 'Identifier' && node.callee.name === 'token') {
		return true;
	}
	return false;
};

// Given a TemplateLiteral node, returns the value of the spacing property as an array of strings
// e.g. `0 ${token('a')} ${token('b')}` -> ['0', 'token('a')', 'token('b')']
const parseTemplateLiteral = (templateLiteral: TemplateLiteral, context: Rule.RuleContext) => {
	const expressions = templateLiteral.expressions;
	const quasis = templateLiteral.quasis;

	let propertyValues: string[] = [];
	for (let i = 0; i < expressions.length || i < quasis.length; i++) {
		if (i < quasis.length) {
			const cookedQuasi = quasis[i].value.cooked;
			if (cookedQuasi) {
				const splitQuasi = cookedQuasi.split(' ').filter((str) => str.trim().length > 0);
				splitQuasi.forEach((str) => {
					propertyValues.push(isNaN(Number(str)) ? `'${str}'` : str);
				});
			}
		}
		if (i < expressions.length) {
			const expr = getSourceCode(context).getText(expressions[i]);
			propertyValues.push(expr);
		}
	}
	return propertyValues;
};

const checkValidPropertyValues = (propertyValues: string[]) => {
	if (!propertyValues.some((str) => str.includes('token('))) {
		return false;
	}
	if (propertyValues.length < 1 || propertyValues.length > 4) {
		return false;
	}
	if (propertyValues.some((str) => str.includes('calc('))) {
		return false;
	}
	return true;
};

// Check that all expressions in TemplateLiteral are token expressions
// If true: create an autofix
// If false: report violation without autofix
const hasOnlyTokens = (templateLiteral: TemplateLiteral) => {
	const expressions = templateLiteral.expressions;
	return expressions.every((expr) => expr.type === 'CallExpression' && isTokenCallExpression(expr));
};

// To fix spacing shorthands, given a list of spacing property values, expands the spacing property and adds autofix fixes
const expandSpacingProperties = ({
	context,
	node,
	propertyValues,
	fixer,
	propertyShorthand,
}: ExpandSpacingPropertiesType) => {
	const [top, right = top, bottom = top, left = right] = propertyValues;
	const spacing: string[] = [top, right, bottom, left];

	const fixes: Rule.Fix[] = [];

	const parentNode = node.parent;
	if (parentNode && parentNode.type === 'ObjectExpression') {
		for (var prop of parentNode.properties) {
			if (prop.type !== 'Property') {
				continue;
			}
			if (
				prop.key.type === 'Identifier' &&
				prop.range &&
				prop.key.name !== `${propertyShorthand}`
			) {
				for (let i = 0; i < spacing.length; i++) {
					if (prop.key.name === `${propertyShorthand}${spacingPos[i]}`) {
						let [start, end] = prop.range;
						// Remove the entire line for the duplicate property
						while (getSourceCode(context).text[end] !== '\n') {
							end += 1;
						}
						while (getSourceCode(context).text[start] !== '\n') {
							start -= 1;
						}
						spacing[i] = getSourceCode(context).getText(prop.value);
						fixes.push(fixer.removeRange([start, end]));
						break;
					}
				}
			}
		}
	}

	fixes.push(fixer.insertTextAfter(node, `${propertyShorthand}Top: ${spacing[0]},\n`));
	fixes.push(fixer.insertTextAfter(node, `\t${propertyShorthand}Right: ${spacing[1]},\n`));
	fixes.push(fixer.insertTextAfter(node, `\t${propertyShorthand}Bottom: ${spacing[2]},\n`));
	fixes.push(fixer.insertTextAfter(node, `\t${propertyShorthand}Left: ${spacing[3]}`));
	fixes.push(fixer.remove(node));
	return fixes;
};

const executeExpandSpacingRule = (
	context: Rule.RuleContext,
	node: Property,
	propertyShorthand: string,
) => {
	if (!isCompiledAPI(context, node)) {
		return;
	}
	if (node.value.type === 'TemplateLiteral') {
		// Value of spacing property is a TemplateLiteral type that contains a token, e.g. padding: `0 token('a')`
		if (!hasOnlyTokens(node.value)) {
			context.report({
				node,
				messageId: 'expandSpacingShorthand',
				data: {
					property: propertyShorthand,
				},
			});
			return;
		}
		const propertyValues = parseTemplateLiteral(node.value, context);
		if (!checkValidPropertyValues(propertyValues)) {
			return;
		}
		context.report({
			node,
			messageId: 'expandSpacingShorthand',
			data: {
				property: propertyShorthand,
			},
			fix(fixer) {
				return expandSpacingProperties({ context, node, propertyValues, fixer, propertyShorthand });
			},
		});
	} else if (node.value.type === 'CallExpression' && isTokenCallExpression(node.value)) {
		// Value of spacing property is a token CallExpression type, e.g. margin: token('space.100', '8px')
		const propertyValues = [getSourceCode(context).getText(node.value)];
		context.report({
			node,
			messageId: 'expandSpacingShorthand',
			data: {
				property: propertyShorthand,
			},
			fix(fixer) {
				return expandSpacingProperties({ context, node, propertyValues, fixer, propertyShorthand });
			},
		});
	}
};

export const expandSpacingShorthand: Rule.RuleModule = {
	meta: {
		docs: {
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/compiled/expand-spacing-shorthand/',
		},
		messages: {
			expandSpacingShorthand:
				'Use {{ property }}Top, {{ property }}Right, {{ property }}Bottom and {{ property }}Left instead of {{ property }} shorthand',
		},
		type: 'problem',
		fixable: 'code',
	},
	create(context) {
		return {
			'Property[key.name="padding"]': function (node: Property) {
				executeExpandSpacingRule(context, node, 'padding');
			},
			'Property[key.name="margin"]': function (node: Property) {
				executeExpandSpacingRule(context, node, 'margin');
			},
		};
	},
};

export default expandSpacingShorthand;
