import { type API, type JSXElement } from 'jscodeshift';

import { NEW_BUTTON_VARIANTS } from './constants';
import { getIconAttributes } from './get-icon-attributes';
import { handleIconAttributes } from './handle-icon-attributes';

export const generateNewElement: (
	variant: (typeof NEW_BUTTON_VARIANTS)[keyof typeof NEW_BUTTON_VARIANTS],
	element: JSXElement,
	j: API['jscodeshift'],
) => JSXElement = (
	variant: (typeof NEW_BUTTON_VARIANTS)[keyof typeof NEW_BUTTON_VARIANTS],
	element: JSXElement,
	j: API['jscodeshift'],
) => {
	const { attributes } = element.openingElement;

	const iconAttrs = attributes && getIconAttributes(attributes);
	const isIconOrLinkIcon =
		variant === NEW_BUTTON_VARIANTS.icon || variant === NEW_BUTTON_VARIANTS.linkIcon;

	if (variant === NEW_BUTTON_VARIANTS.link) {
		j(element)
			.find(j.JSXAttribute)
			.filter(
				(path) =>
					path.node.name.name === 'appearance' &&
					path.node.value?.type === 'StringLiteral' &&
					(path.node.value.value === 'subtle-link' || path.node.value.value === 'link'),
			)
			.replaceWith(j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral('subtle')));
	}

	if (isIconOrLinkIcon && iconAttrs?.length) {
		handleIconAttributes(element, j, true);

		// rename iconBefore/iconAfter to icon
		iconAttrs[0].name.name = 'icon';

		const ariaLabelAttr = j(element.openingElement)
			.find(j.JSXAttribute)
			.filter((attribute) => attribute.node.name.name === 'aria-label');
		if (ariaLabelAttr.length) {
			const hasNoLabelProp = !attributes?.find(
				(attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === 'label',
			);

			if (hasNoLabelProp && attributes) {
				attributes.unshift(
					j.jsxAttribute.from({
						name: j.jsxIdentifier('label'),
						value: j.literal(ariaLabelAttr.get().value.value.value),
					}),
				);
			}
			ariaLabelAttr.remove();
		}
	}

	return j.jsxElement.from({
		openingElement: j.jsxOpeningElement(j.jsxIdentifier(variant), attributes, isIconOrLinkIcon),
		// self closing if it's an icon button or icon link button
		closingElement: isIconOrLinkIcon ? null : j.jsxClosingElement(j.jsxIdentifier(variant)),
		children: element.children,
	});
};
