import React from 'react';

/**
 * Recursively extracts plain text content from a ReactNode.
 *
 * This is useful when a ReactNode needs to be represented as a string,
 * e.g. for use in an `aria-label` attribute.
 */
const getTextFromReactNode = (node: React.ReactNode): string => {
	if (node == null || typeof node === 'boolean') {
		return '';
	}
	if (typeof node === 'string') {
		return node;
	}
	if (typeof node === 'number') {
		return String(node);
	}
	if (Array.isArray(node)) {
		return node.map(getTextFromReactNode).join('');
	}
	if (React.isValidElement(node)) {
		return getTextFromReactNode(node.props.children);
	}
	return '';
};

export default getTextFromReactNode;
