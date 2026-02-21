import { type JSXAttribute, type JSXOpeningElement, type JSXSpreadAttribute } from 'jscodeshift';

export const findJSXAttributeWithValue: (
	path: JSXOpeningElement | JSXSpreadAttribute | undefined,
	attributeName: string,
	attributeValue: string,
) => boolean = (
	path: JSXOpeningElement | JSXSpreadAttribute | undefined,
	attributeName: string,
	attributeValue: string,
) => {
	if (!path || path.type === 'JSXSpreadAttribute') {
		return false;
	}
	const attribute = path?.attributes?.find(
		(attribute: JSXAttribute | JSXSpreadAttribute) =>
			attribute.type === 'JSXAttribute' &&
			attribute.name.name === attributeName &&
			attribute.value?.type === 'StringLiteral' &&
			attribute.value.value === attributeValue,
	);

	return Boolean(attribute);
};
