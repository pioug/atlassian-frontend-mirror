import type { Rule, Scope } from 'eslint';
import { type Identifier, isNodeOfType, type Node } from 'eslint-codemod-utils';
import type { ObjectExpression, Property, SpreadElement, VariableDeclarator } from 'estree-jsx';

import {
	getAllowedFunctionCalls,
	isAllowListedVariable,
} from '@atlaskit/eslint-utils/allowed-function-calls';
import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

import { createLintRule } from '../utils/create-rule';

type ObjProperty = Property | SpreadElement;
type IdentifierWithParent = Scope.Reference['identifier'] & Rule.NodeParentExtension;

const isIdentifierAllowed = (context: Rule.RuleContext, identifier: Identifier): boolean => {
	const variable = findVariable({
		sourceCode: getSourceCode(context),
		identifier: identifier,
	});

	if (!variable) {
		return false;
	}

	// If identifier is a RestElement, report warning
	if ((variable.identifiers[0] as IdentifierWithParent)?.parent?.type === 'RestElement') {
		return false;
	}

	const firstDef = variable.defs[0];
	if (firstDef.type === 'Parameter') {
		// This ultimately comes from a function parameter, eg. `const value = props.value`
		// ultimately finds this `function (props)` or `function({ width })` and those are parameters
		return true;
	}

	if (firstDef.type !== 'Variable') {
		// If this isn't a variable, eg. not `const value = props.value`, it's not an identifier we can track
		return false;
	}

	const variableDefinition = firstDef.node as VariableDeclarator & Rule.NodeParentExtension;
	if (variableDefinition.type !== 'VariableDeclarator') {
		return false;
	}

	// Checking if identifier has been destructured from props within function
	// If it's a `let var = …`, ignore, we assume it's dynamically set (but it could be static)
	if ('kind' in variableDefinition.parent && variableDefinition.parent.kind === 'let') {
		return true;
	}

	// Allow for `const { width } = props as Props` (etc)
	let init = variableDefinition.init!;

	// This is not typed for TS types
	if (
		init.type === ('TSAsExpression' as string) &&
		'expression' in init &&
		typeof init.expression !== 'boolean'
	) {
		init = init.expression;
	}

	// If it's initialised by a call expression, ignore
	if (init.type === 'CallExpression') {
		return true;
	}

	if (init.type === 'BinaryExpression') {
		// If it's initialized like `const var = 1 * props.value`, validate either side
		if (init.left.type === 'MemberExpression') {
			return isIdentifierAllowed(context, init.left.object as Identifier);
		}

		if (init.right.type === 'MemberExpression') {
			return isIdentifierAllowed(context, init.right.object as Identifier);
		}
	}

	if (init.type === 'ConditionalExpression') {
		// If it's initialized like `const var = props.value ? 42 : 1`, validate either side
		if (init.test.type === 'MemberExpression') {
			return isIdentifierAllowed(context, init.test.object as Identifier);
		}

		if (init.consequent.type === 'MemberExpression') {
			return isIdentifierAllowed(context, init.consequent.object as Identifier);
		}

		if (init.alternate.type === 'MemberExpression') {
			return isIdentifierAllowed(context, init.alternate.object as Identifier);
		}
	}

	// Destructured from member expression
	// e.g. const width = props.width
	if (init.type === 'MemberExpression') {
		return isIdentifierAllowed(context, init.object as Identifier);
	}

	// Destructured from object pattern
	// e.g. const { width } = props
	return isIdentifierAllowed(context, init as Identifier);
};

function isPropertyValueAllowed(property: ObjProperty, context: Rule.RuleContext): boolean {
	if (property.type === 'SpreadElement') {
		return false;
	}

	// property.type === 'Property', moving on to check if value is static
	if (property.value.type === 'Literal') {
		return false;
	} else if (property.value.type === 'Identifier') {
		return isIdentifierAllowed(context, property.value);
	} else if (
		property.value.type === 'CallExpression' &&
		property.value.callee.type === 'Identifier'
	) {
		const variable = findVariable({
			sourceCode: getSourceCode(context),
			identifier: property.value.callee,
		});
		// Anything returned by getAllowedFunctionCalls should be used in css prop instead
		const functionAllowList = getAllowedFunctionCalls(context.options);
		if (
			!variable ||
			isAllowListedVariable({
				allowList: functionAllowList,
				variable,
			})
		) {
			return false;
		}
	} else if (
		property.value.type === 'MemberExpression' &&
		property.value.object.type === 'Identifier'
	) {
		const definitions = findVariable({
			sourceCode: getSourceCode(context),
			identifier: property.value.object,
		})?.defs;
		if (!definitions || !definitions.length) {
			return false;
		}
		const variable = definitions[0];
		if (!variable) {
			return false;
		}
		const varType = variable.type;

		if (varType === 'Variable') {
			if (!variable.node.init) {
				return false;
			}
			const varSource = variable.node.init.type;
			// Variables initialised by a call expression or object expression are ok
			if (varSource === 'CallExpression' || varSource === 'ObjectExpression') {
				return true;
			}
			// Check if member expression matches with function argument
		} else if (varType !== 'Parameter') {
			return false;
		}
	}
	return true;
}

export const rule = createLintRule({
	meta: {
		name: 'enforce-style-prop',
		docs: {
			description: 'Disallows usage of static styles in the `style` attribute in components',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'enforce-style-prop':
				'Avoid adding static values to the style prop. Use the css prop for static styles instead.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			'JSXAttribute[name.name="style"] > JSXExpressionContainer': (node: Node) => {
				if (!isNodeOfType(node, 'JSXExpressionContainer')) {
					return;
				}

				// we've reached an attribute named style

				let expression: ObjectExpression | null = null;
				let reportOnNodeExpression: boolean = false;
				if (
					// @ts-expect-error -- TSAsExpression is not valid in estree
					node.expression.type === 'TSAsExpression' &&
					// @ts-expect-error -- TSAsExpression is not valid in estree
					node.expression.expression?.type === 'ObjectExpression'
				) {
					// This is a `style={{ … } as React.CSSProperties}` scenario
					// @ts-expect-error -- TSAsExpression is not valid in estree
					expression = node.expression.expression;
				} else if (node.expression.type === 'ObjectExpression') {
					// Typical `style={{ … }}` scenario
					expression = node.expression;
				} else if (node.expression.type === 'Identifier') {
					/*
					 * Example:
					 * ```tsx
					 * const style = { width: 100 };
					 * <div style={style} />
					 * ```
					 */
					const variable = findVariable({
						sourceCode: getSourceCode(context),
						identifier: node.expression,
					});

					// Types are alluding us here, but we really only want an ObjectExpression here
					// Additionally, if we have multiple variable definitions, we're in some unhandled scenario
					// so we're only going to look at the first one…
					const hopefulObjectExpression: ObjectExpression | undefined =
						variable?.defs?.[0]?.node?.init;
					if (hopefulObjectExpression?.type === 'ObjectExpression') {
						expression = hopefulObjectExpression;
					}

					reportOnNodeExpression = true;
				}

				if (!expression?.properties) {
					context.report({
						node: node,
						messageId: 'enforce-style-prop',
					});

					return;
				}

				if (reportOnNodeExpression) {
					// In some cases we want to report on the `node.expression` itself, eg.
					// `styles` in `style={styles}` should get the error
					if (expression.properties.some((value) => !isPropertyValueAllowed(value, context))) {
						context.report({
							node: node.expression,
							messageId: 'enforce-style-prop',
						});
					}
				} else {
					// Typically we want to report on the individual styles, eg.
					// `color: 'red'` in `style={{ color: 'red' }}` should get the error
					expression.properties.forEach((value) => {
						if (!isPropertyValueAllowed(value, context)) {
							context.report({
								node: value,
								messageId: 'enforce-style-prop',
							});
						}
					});
				}
			},
		};
	},
});

export default rule;
