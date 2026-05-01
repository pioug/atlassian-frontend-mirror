import { isNodeOfType, type JSXAttribute, type JSXElement } from 'eslint-codemod-utils';

import { getStaticAttributeValue } from './get-static-attribute-value';

/**
 * Returns the static `size` prop value, defaulting to 'medium' if not present.
 */
export function getIconSize(node: JSXElement): string | undefined {
	if (!isNodeOfType(node.openingElement, 'JSXOpeningElement')) {
		return 'medium';
	}

	const sizeAttr = node.openingElement.attributes.find(
		(a): a is JSXAttribute => a.type === 'JSXAttribute' && a.name.name === 'size',
	);

	if (!sizeAttr) {
		return 'medium';
	}

	return getStaticAttributeValue(sizeAttr);
}
