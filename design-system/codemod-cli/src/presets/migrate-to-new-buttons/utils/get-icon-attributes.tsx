import { type JSXAttribute, type JSXSpreadAttribute } from 'jscodeshift';

export const getIconAttributes: (
	attributes: (JSXAttribute | JSXSpreadAttribute)[],
) => JSXAttribute[] | null = (
	attributes: (JSXAttribute | JSXSpreadAttribute)[],
): JSXAttribute[] | null => {
	const iconAttr = attributes?.filter(
		(attribute) =>
			attribute.type === 'JSXAttribute' &&
			(attribute.name.name === 'iconBefore' || attribute.name.name === 'iconAfter'),
	);

	if (iconAttr?.length) {
		return iconAttr as JSXAttribute[];
	}

	return null;
};
