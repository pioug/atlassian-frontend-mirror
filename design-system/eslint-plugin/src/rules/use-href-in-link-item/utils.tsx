// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule, Scope } from 'eslint';
import { type ImportDeclaration, isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

import { findIdentifierInParentScope } from '../utils/find-in-parent';

const invalidHrefValues = ['', '#', null, undefined];

export const hrefHasInvalidValue = (
	scope: Scope.Scope,
	href: JSXAttribute | undefined,
): boolean => {
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

export const hasImportOfName = (node: ImportDeclaration, name: string): boolean => {
	return node.specifiers.some(
		// This should not be an `any`. This is an array of `ImportSpecifier |
		// ImportDefaultSpecifier`. For some reason, filtering this way still
		// results in an error of `specifier.imported` doesn't exist on
		// ImportDefaultSpecifier, which is exactly what I'm filtering for
		(specifier: any) => specifier?.imported?.name === name,
	);
};

export const insertButtonItemDefaultImport = (fixer: Rule.RuleFixer, node: ImportDeclaration) =>
	fixer.insertTextBefore(node, `import ButtonItem from '@atlaskit/menu/button-item';\n`);

export const getUniqueButtonItemName = (
	menuNode: ImportDeclaration | null,
	importDeclarations: ImportDeclaration[],
): string => {
	// Remove menu import node from array
	const allImportDeclarationsButMenu = importDeclarations.filter((i) => i !== menuNode);

	let currentButtonItemNameExistsOtherThanMenu: boolean = allImportDeclarationsButMenu.reduce(
		(acc, importNode) => acc || hasImportOfName(importNode, 'ButtonItem'),
		false,
	);

	if (currentButtonItemNameExistsOtherThanMenu) {
		let suffix = 1;

		while (currentButtonItemNameExistsOtherThanMenu) {
			suffix += 1;
			currentButtonItemNameExistsOtherThanMenu = allImportDeclarationsButMenu.reduce(
				(acc, importNode) => acc || hasImportOfName(importNode, `ButtonItem${suffix}`),
				false,
			);
		}

		return `ButtonItem${suffix}`;
	} else {
		return 'ButtonItem';
	}
};

export const insertButtonItemImport = (
	fixer: Rule.RuleFixer,
	node: ImportDeclaration,
	uniqueButtonItemName: string,
) => {
	const insertedImport =
		uniqueButtonItemName !== 'ButtonItem'
			? `, ButtonItem as ${uniqueButtonItemName}`
			: ', ButtonItem';

	return fixer.insertTextAfter(node.specifiers.slice(-1)[0], insertedImport);
};
