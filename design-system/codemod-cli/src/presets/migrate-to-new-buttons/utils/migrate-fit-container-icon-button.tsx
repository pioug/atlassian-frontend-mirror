import type { API, ASTPath } from 'jscodeshift';
import { addCommentBefore } from '@atlaskit/codemod-utils';

import { getIconAttributes, getIconElement } from '../utils/generate-new-button-element';
import {
	NEW_BUTTON_VARIANTS,
	migrateFitContainerButtonToDefaultButtonComment,
	migrateFitContainerButtonToIconButtonComment,
} from './constants';
import { type JSXElement } from 'jscodeshift';

export const migrateFitContainerIconButton = (
	element: ASTPath<JSXElement>,
	j: API['jscodeshift'],
): boolean => {
	const { attributes } = element.value.openingElement;

	const iconAttrs = attributes && getIconAttributes(attributes);
	const iconElement = iconAttrs && iconAttrs[0] && getIconElement(iconAttrs[0]);

	const labelAttribute =
		iconElement &&
		Array.isArray(iconElement.openingElement.attributes) &&
		iconElement.openingElement?.attributes.find(
			(path) =>
				path.type === 'JSXAttribute' &&
				(path.name.name === 'label' ||
					path.name.name === 'aria-label' ||
					path.name.name === 'aria-labelledby'),
		);

	let migratedToIconButton;
	if (
		labelAttribute &&
		labelAttribute.type === 'JSXAttribute' &&
		labelAttribute.value?.type === 'StringLiteral' &&
		typeof labelAttribute.value.value === 'string'
	) {
		migratedToIconButton = false;
		const label = labelAttribute.value.value;
		const formattedLabel = `${label.charAt(0).toUpperCase()}${label.slice(1)}`.split('-').join(' ');
		j(element)
			.find(j.JSXAttribute)
			.filter((path) => path.node.name.name === 'iconBefore' || path.node.name.name === 'iconAfter')
			.remove();
		const newButton = j.jsxElement(
			j.jsxOpeningElement(j.jsxIdentifier(NEW_BUTTON_VARIANTS.default), attributes),
			j.jsxClosingElement(j.jsxIdentifier(NEW_BUTTON_VARIANTS.default)),
			[j.jsxText(formattedLabel)],
		);
		j(element).replaceWith(newButton);

		addCommentBefore(
			j,
			j(newButton)
				.find(j.JSXAttribute)
				.filter((path) => path.node.name.name === 'shouldFitContainer'),
			migrateFitContainerButtonToDefaultButtonComment,
			'line',
		);
	} else {
		migratedToIconButton = true;

		addCommentBefore(
			j,
			j(element)
				.find(j.JSXAttribute)
				.filter(
					(path) => path.node.name.name === 'iconBefore' || path.node.name.name === 'iconAfter',
				),
			migrateFitContainerButtonToIconButtonComment,
			'line',
		);

		j(element)
			.find(j.JSXAttribute)
			.filter((path) => path.node.name.name === 'shouldFitContainer')
			.remove();
	}
	return migratedToIconButton;
};
