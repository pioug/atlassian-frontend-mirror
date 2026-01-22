import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

export function hasProp(node: JSXElement, propName: string): boolean {
	return (
		isNodeOfType(node.openingElement, 'JSXOpeningElement') &&
		node.openingElement.attributes.some(
			(a) => a.type === 'JSXAttribute' && a.name.name === propName,
		)
	);
}
