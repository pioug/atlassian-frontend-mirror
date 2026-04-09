import { type JSXAttribute, type JSXElement } from 'jscodeshift';

export const getIconElement: (iconAttr: JSXAttribute) => JSXElement | null = (
	iconAttr: JSXAttribute,
) => {
	if (
		iconAttr &&
		iconAttr.value?.type === 'JSXExpressionContainer' &&
		iconAttr.value.expression.type === 'JSXElement'
	) {
		return iconAttr.value.expression;
	}
	return null;
};
