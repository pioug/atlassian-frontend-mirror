import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type JSXElement,
	type JSXIdentifier,
	type JSXOpeningElement,
} from 'eslint-codemod-utils';

export type ImportedJSXElement = JSXElement &
	Rule.NodeParentExtension & { openingElement: JSXOpeningElement & { name: JSXIdentifier } };

export function isImportedJSXElement(node: Rule.Node): node is ImportedJSXElement {
	return (
		isNodeOfType(node, 'JSXElement') && isNodeOfType(node.openingElement.name, 'JSXIdentifier')
	);
}
