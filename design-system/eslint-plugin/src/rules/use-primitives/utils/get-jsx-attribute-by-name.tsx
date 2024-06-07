import {
	isNodeOfType,
	type JSXAttribute,
	type JSXOpeningElement,
	type JSXSpreadAttribute,
} from 'eslint-codemod-utils';

export const getJSXAttributeByName = (
	node: JSXOpeningElement,
	attrName: string,
): JSXAttribute | undefined => {
	return node.attributes.find((attr: JSXAttribute | JSXSpreadAttribute): boolean => {
		// Ignore anything other than JSXAttribute
		if (!isNodeOfType(attr, 'JSXAttribute')) {
			return false;
		}

		return attr.name.name === attrName;
	}) as JSXAttribute | undefined;
};
