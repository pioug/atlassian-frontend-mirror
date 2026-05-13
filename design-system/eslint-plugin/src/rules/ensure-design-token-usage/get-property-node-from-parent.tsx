import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type ObjectExpression,
	type Property,
	type SpreadElement,
} from 'eslint-codemod-utils';

export function getPropertyNodeFromParent(
	property: string,
	parentNode: ObjectExpression & Rule.NodeParentExtension,
): Property | SpreadElement | undefined {
	const propertyNode = parentNode.properties.find((node) => {
		if (!isNodeOfType(node, 'Property')) {
			return;
		}

		if (!isNodeOfType(node.key, 'Identifier')) {
			return;
		}

		return node.key.name === property;
	});

	return propertyNode;
}
