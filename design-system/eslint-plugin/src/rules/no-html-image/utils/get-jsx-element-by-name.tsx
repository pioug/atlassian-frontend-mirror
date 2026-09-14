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

	// `@typescript-eslint/scope-manager` v8 records a reference for both the opening *and* the
	// closing tag of an element, where v7 only recorded the opening one. So key off the opening
	// elements rather than the raw reference count, which differs between the two.
	const jsxOpeningElements = variableDeclaration.references
		.map((ref) => ref?.identifier)
		.filter((identifier) => isNodeOfType(identifier, 'JSXIdentifier'))
		.map((identifier) => (identifier as JSXIdentifier & Rule.NodeParentExtension).parent)
		.filter((parent) => isNodeOfType(parent, 'JSXOpeningElement'));

	// Anything that isn't a JSX reference, beyond the declaration itself, means the component is
	// also used somewhere we can't reason about.
	const nonJsxReferences = variableDeclaration.references.filter(
		(ref) => !isNodeOfType(ref?.identifier, 'JSXIdentifier'),
	);

	// there should be exactly one JSX call site, and the declaration as the only other reference.
	// we might consider handling multiple local JSX call sites in the future
	// but "this is good enough for now"™️
	if (jsxOpeningElements.length !== 1 || nonJsxReferences.length !== 1) {
		return;
	}

	return jsxOpeningElements[0] as JSXOpeningElement & Rule.NodeParentExtension;
};
