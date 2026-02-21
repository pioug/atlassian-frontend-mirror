import type { JSXAttribute, JSXSpreadAttribute } from 'jscodeshift';

import { unsupportedProps } from './constants';

export const ifHasUnsupportedProps = (
	attributes: (JSXAttribute | JSXSpreadAttribute)[] | undefined,
): boolean => {
	let hasUnsupportedProps = Boolean(
		attributes &&
		attributes?.some(
			(node) => node.type === 'JSXAttribute' && unsupportedProps.includes(String(node.name.name)),
		),
	);

	const hasUnmigratableIcon = () => {
		const oldIconProps = ['iconBefore', 'iconAfter'];
		let hasUnmigratableIcon = false;

		if (
			!attributes?.some(
				(attribute) =>
					attribute.type === 'JSXAttribute' &&
					attribute.name.type === 'JSXIdentifier' &&
					oldIconProps.includes(attribute.name.name),
			)
		) {
			return hasUnmigratableIcon;
		}

		oldIconProps.forEach((oldIconProp) => {
			const iconAttribute = attributes.find(
				(attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === oldIconProp,
			);

			if (!iconAttribute) {
				return;
			}

			// check to see if the element is self closing, otherwise assume it's not an icon (may contain wrapper)
			if (
				iconAttribute.type === 'JSXAttribute' &&
				iconAttribute.value?.type === 'JSXExpressionContainer' &&
				iconAttribute.value.expression.type === 'JSXElement' &&
				!iconAttribute.value.expression.openingElement.selfClosing
			) {
				hasUnmigratableIcon = true;
			}
		});

		return hasUnmigratableIcon;
	};

	return hasUnsupportedProps || hasUnmigratableIcon();
};
