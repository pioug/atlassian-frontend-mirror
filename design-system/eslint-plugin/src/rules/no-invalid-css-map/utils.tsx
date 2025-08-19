import type { Rule } from 'eslint';
import type { CallExpression, ObjectExpression, Property } from 'estree';

import {
	type AllowList,
	getAllowedFunctionCalls,
	isAllowListedVariable,
} from '@atlaskit/eslint-utils/allowed-function-calls';
import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

type Reporter = Rule.RuleContext['report'];

export const getCssMapObject = (node: CallExpression): ObjectExpression | undefined => {
	// We assume the argument `node` is already a cssMap() call.

	// Things like the number of arguments to cssMap and the type of
	// cssMap's argument are handled by the TypeScript compiler, so
	// we don't bother with creating eslint errors for these here

	if (node.arguments.length !== 1 || node.arguments[0].type !== 'ObjectExpression') {
		return;
	}

	return node.arguments[0];
};

export class CssMapObjectChecker {
	private readonly allowedFunctionCalls: AllowList;
	private readonly cssMapObject: ObjectExpression;

	private readonly report: Reporter;
	private readonly context: Rule.RuleContext;

	constructor(cssMapObject: ObjectExpression, context: Rule.RuleContext) {
		this.allowedFunctionCalls = getAllowedFunctionCalls(context.options);
		this.cssMapObject = cssMapObject;

		this.report = context.report;
		this.context = context;
	}

	private checkCssMapObjectValue(value: Property['value']): void {
		if (value.type === 'CallExpression' && value.callee.type === 'Identifier') {
			// object value is a function call in the style
			// {
			//     key: functionCall(), ...
			// }
			const variable = findVariable({
				identifier: value.callee,
				sourceCode: getSourceCode(this.context),
			});
			if (
				!variable ||
				!isAllowListedVariable({
					allowList: this.allowedFunctionCalls,
					variable,
				})
			) {
				this.report({
					node: value,
					messageId: 'noFunctionCalls',
				});
			}
		} else if (value.type === 'ArrowFunctionExpression' || value.type === 'FunctionExpression') {
			// object value is a function call in the style
			// {
			//     key: (prop) => prop.color,       // ArrowFunctionExpression
			//     get danger() { return { ... } }, // FunctionExpression
			// }
			this.report({
				node: value,
				messageId: 'noInlineFunctions',
			});
		} else if (value.type === 'BinaryExpression' || value.type === 'LogicalExpression') {
			// @ts-ignore -- this needs to be `ts-ignore` because this only errors in jira's typechecking due to update, not platform's
			this.checkCssMapObjectValue(value.left);
			this.checkCssMapObjectValue(value.right);
		} else if (value.type === 'Identifier') {
			const variable = findVariable({
				identifier: value,
				sourceCode: getSourceCode(this.context),
			});

			// Get the variable's definition when initialised, and check the first definition that we find.
			//
			// Ideally we would try to get the variable's value at the point at which
			// cssMap() is run, but ESLint doesn't seem to give us an easy way to
			// do that...
			const definitions = variable?.defs;
			if (!definitions || definitions.length === 0) {
				// Variable is not defined :thinking:
				return;
			}

			for (const definition of definitions) {
				if (definition.type === 'Variable' && definition.node.init) {
					return this.checkCssMapObjectValue(definition.node.init);
				}
			}
		} else if (value.type === 'ObjectExpression') {
			// Object inside another object
			this.checkCssMapObject(value);
		} else if (value.type === 'TemplateLiteral') {
			// object value is a template literal, something like
			//     `hello world`
			//     `hello ${functionCall()} world`
			//     `hello ${someVariable} world`
			// etc.
			//
			// where the expressions are the parts enclosed within the
			// ${ ... }
			for (const expression of value.expressions) {
				this.checkCssMapObjectValue(expression);
			}
		}
	}

	private checkCssMapObject(cssMapObject: ObjectExpression) {
		for (const property of cssMapObject.properties) {
			if (property.type === 'SpreadElement') {
				this.report({
					node: property,
					messageId: 'noSpreadElement',
				});
				continue;
			}

			this.checkCssMapObjectValue(property.value);
		}
	}

	run(): void {
		this.checkCssMapObject(this.cssMapObject);
	}
}
