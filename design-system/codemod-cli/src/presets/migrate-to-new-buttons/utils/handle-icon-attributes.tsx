import { type API, type JSXElement } from 'jscodeshift';

import { getIconAttributes } from './get-icon-attributes';
import { getIconElement } from './get-icon-element';

export const handleIconAttributes: (
	element: JSXElement,
	j: API['jscodeshift'],
	iconRenamed?: boolean,
) => void = (element: JSXElement, j: API['jscodeshift'], iconRenamed: boolean = false) => {
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
