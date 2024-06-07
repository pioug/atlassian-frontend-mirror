import type { Rule, Scope } from 'eslint';
import { isNodeOfType, type JSXIdentifier, type JSXOpeningElement } from 'eslint-codemod-utils';

/**
 * Given a component name finds its JSX usage
 */
export const getJsxElementByName = (
	componentName: string,
	scope: Scope.Scope,
): (JSXOpeningElement & Rule.NodeParentExtension) | undefined => {
	const variableDeclaration = scope.variables.find((v) => v.name === componentName);
	if (!variableDeclaration) {
		return;
	}

	// length here should be exactly 2 to indicate only two references:
	// one being the variable declaration itself
	// second being the JSX call site
	// we might consider handling multiple local JSX call sites in the future
	// but "this is good enough for now"™️
	if (variableDeclaration.references.length !== 2) {
		return;
	}

	let jsxUsage = variableDeclaration.references[1]?.identifier;

	const [firstIdentifier, secondIdentifier] = variableDeclaration.references.map(
		(ref) => ref?.identifier,
	);
	// Check if the first reference is a JSXOpeningElement and the second is not or vice versa
	if (
		isNodeOfType(firstIdentifier, 'JSXIdentifier') &&
		!isNodeOfType(secondIdentifier, 'JSXIdentifier')
	) {
		jsxUsage = firstIdentifier;
	} else if (
		isNodeOfType(secondIdentifier, 'JSXIdentifier') &&
		!isNodeOfType(firstIdentifier, 'JSXIdentifier')
	) {
		jsxUsage = secondIdentifier;
	} else {
		return;
	}

	if (!isNodeOfType(jsxUsage, 'JSXIdentifier')) {
		return;
	}

	const jsxOpeningElement = (jsxUsage as JSXIdentifier & Rule.NodeParentExtension).parent;
	if (!isNodeOfType(jsxOpeningElement, 'JSXOpeningElement')) {
		return;
	}

	return jsxOpeningElement;
};
