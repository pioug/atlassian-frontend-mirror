import type { Scope } from 'eslint';
import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { findIdentifierInParentScope } from '../utils/find-in-parent';

const invalidHrefValues = ['', '#', null, undefined];

export const hrefHasInvalidValue: (
	scope: Scope.Scope,
	href: JSXAttribute | undefined,
) => boolean = (scope: Scope.Scope, href: JSXAttribute | undefined): boolean => {
	// If doesn't exist,
	if (!href) {
		return true;
	} else if (href.value) {
		// If it is an invalid literal,
		if (
			isNodeOfType(href.value, 'Literal') &&
			// We know this must be a string because node is type 'Literal'
			invalidHrefValues.includes(href.value.value as string)
		) {
			return true;
			// If it is an expression with a variable inside
		} else if (
			isNodeOfType(href.value, 'JSXExpressionContainer') &&
			isNodeOfType(href.value.expression, 'Identifier')
		) {
			// Get value within the variable
			const identifierName = href.value.expression.name;

			const variable: Scope.Variable | null = findIdentifierInParentScope({
				scope,
				identifierName,
			});

			// If the variable can't be found in the parent scope, do not throw as
			// invalid because we can't know what the value actually is.
			if (variable) {
				const defNode = variable.defs[0].node;
				// Should be accepted as a valid `href` for
				// * imported variables
				// * local variables with an valid value
				// * local variables defined via destructuring
				// * arguments in a function declaration
				// * arguments in an anonymous function
				if (
					defNode?.imported ||
					(defNode?.init?.value && !invalidHrefValues.includes(defNode?.init?.value)) ||
					(isNodeOfType(defNode, 'VariableDeclarator') &&
						defNode?.init &&
						isNodeOfType(defNode.init, 'Identifier') &&
						isNodeOfType(defNode.id, 'ObjectPattern')) ||
					isNodeOfType(defNode, 'FunctionDeclaration') ||
					isNodeOfType(defNode, 'ArrowFunctionExpression')
				) {
					return false;
				} else {
					return true;
				}
			}
		}
	}

	return false;
};
