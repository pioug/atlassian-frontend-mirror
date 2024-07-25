import { type API, type JSXAttribute, type JSXElement, type JSXSpreadAttribute } from 'jscodeshift';

import { NEW_BUTTON_VARIANTS } from '../utils/constants';

export const getIconAttributes = (
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

export const getIconElement = (iconAttr: JSXAttribute) => {
	if (
		iconAttr &&
		iconAttr.value?.type === 'JSXExpressionContainer' &&
		iconAttr.value.expression.type === 'JSXElement'
	) {
		return iconAttr.value.expression;
	}
	return null;
};

/**
 * We need to do a couple of things here:
 *
 * 1. If an icon attribute has a label, elevate it to the root button element
 * 2. If an icon doesn't have any other attributes, move to bounded API:
 *      {<MoreIcon />} -> {MoreIcon}
 * 3. If an icon has attributes other than label, move to renderProp:
 *      {<MoreIcon primaryColor />} -> {() => <MoreIcon primaryColor />}
 *
 * @param element
 * @param j
 * @param iconRenamed
 */
export const handleIconAttributes = (
	element: JSXElement,
	j: API['jscodeshift'],
	iconRenamed: boolean = false,
) => {
	const { attributes: buttonAttributes } = element.openingElement;
	// Get iconBefore and iconAfter attributes
	const buttonIconAttributes = buttonAttributes && getIconAttributes(buttonAttributes);

	buttonIconAttributes?.forEach((iconAttribute) => {
		let iconElement = getIconElement(iconAttribute);
		if (!iconElement) {
			return;
		}
		const iconAttributes = iconElement.openingElement.attributes;

		if (!Array.isArray(iconAttributes)) {
			return;
		}

		// 1. Move label to root button element, only if label doesn't exist already. Button label
		// takes precedence over icon label.

		const buttonAlreadyHasLabelProp = buttonAttributes?.find(
			(buttonAttribute) =>
				buttonAttribute.type === 'JSXAttribute' && buttonAttribute.name.name === 'label',
		);

		const buttonAlreadyHasAriaLabelProp = buttonAttributes?.find(
			(buttonAttribute) =>
				buttonAttribute.type === 'JSXAttribute' && buttonAttribute.name.name === 'aria-label',
		);

		if (!buttonAlreadyHasLabelProp && !buttonAlreadyHasAriaLabelProp) {
			const labelAttribute = iconAttributes.find(
				(attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === 'label',
			);
			if (labelAttribute && labelAttribute.type === 'JSXAttribute' && iconRenamed) {
				buttonAttributes?.unshift(labelAttribute);
			}
		}

		// 2. If there are any other props on icon, move to render prop
		const attributesOtherThanLabelOrMediumSize = iconAttributes.filter((iconAttribute) => {
			// Exclude size="medium"
			if (
				iconAttribute.type === 'JSXAttribute' &&
				iconAttribute.name.name === 'size' &&
				iconAttribute.value?.type === 'StringLiteral' &&
				iconAttribute.value?.value === 'medium'
			) {
				return false;
			}

			// Exclude label
			if (iconAttribute.type === 'JSXAttribute' && iconAttribute.name.name === 'label') {
				return false;
			}

			return true;
		});

		if (attributesOtherThanLabelOrMediumSize.length > 0) {
			// Move to render prop: `<MoreIcon primaryColor />` -> `(props) => <MoreIcon {...props} primaryColor />`

			// Remove label and size="medium" attributes
			j(iconElement.openingElement)
				.find(j.JSXAttribute)
				.filter(
					(attribute) =>
						attribute.value.name.name === 'label' ||
						(attribute.value.type === 'JSXAttribute' &&
							attribute.value.name.name === 'size' &&
							attribute.value.value &&
							attribute.value.value.type === 'StringLiteral' &&
							attribute.value.value.value === 'medium') ||
						false,
				)
				.remove();

			// Add spread props
			iconAttributes.unshift(j.jsxSpreadAttribute(j.identifier('iconProps')));

			// Create new arrow function (renderProp)
			iconAttribute.value = j.jsxExpressionContainer(
				j.arrowFunctionExpression.from({
					params: [j.identifier('iconProps')],
					body: iconElement,
					expression: true,
				}),
			);
		} else {
			// Move to bounded API: {<MoreIcon />} => {MoreIcon}
			if (
				iconElement.openingElement.name.type === 'JSXIdentifier' &&
				iconAttribute.value?.type === 'JSXExpressionContainer'
			) {
				iconAttribute.value.expression = j.identifier(iconElement.openingElement.name.name);
			}
		}
	});
};

export const generateNewElement = (
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

export const modifyButtonAttributes = (
	element: JSXElement,
	j: API['jscodeshift'],
	hasSpacingNone: boolean,
) => {
	j(element)
		.find(j.JSXAttribute)
		.filter(
			(path) =>
				path.node.name.name === 'appearance' &&
				path.node.value?.type === 'StringLiteral' &&
				(path.node.value.value === 'link' || path.node.value.value === 'subtle-link'),
		)
		.replaceWith(j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral('subtle')));

	if (hasSpacingNone) {
		j(element)
			.find(j.JSXAttribute)
			.filter(
				(path) =>
					path.node.name.name === 'spacing' &&
					path.node.value?.type === 'StringLiteral' &&
					path.node.value.value === 'none',
			)
			.remove();
	}
};
