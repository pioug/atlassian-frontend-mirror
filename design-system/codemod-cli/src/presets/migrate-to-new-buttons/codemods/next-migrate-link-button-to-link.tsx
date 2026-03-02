/* eslint-disable @repo/internal/fs/filename-pattern-match */
import { getImportDeclaration } from '@hypermod/utils';
import { type API, type ASTPath, type FileInfo, type ImportDeclaration } from 'jscodeshift';

import { addCommentBefore } from '@atlaskit/codemod-utils';

import {
	migrateButtonToSubtleLinkButton,
	migrateSubtleButtonToSubtleLinkButton,
	NEW_BUTTON_ENTRY_POINT,
	NEW_BUTTON_VARIANTS,
	PRINT_SETTINGS,
} from '../utils/constants';
import { findJSXAttributeWithValue } from '../utils/find-attribute-with-value';
import { modifyLinkAttributes } from '../utils/generate-link-element';
import moveIconValueFromLinkButtonPropsToLinkChildren from '../utils/move-icon-value-from-link-button-to-link-children';

function transformer(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const source = j(file.source);

	// Find all new button imports
	const newButtonImportDeclarations = getImportDeclaration(j, source, NEW_BUTTON_ENTRY_POINT);

	// No imports for new button found, exit early
	if (!newButtonImportDeclarations.length) {
		return source.toSource();
	}

	let linkButtonSpecifier = '';
	let linkButtonDeclaration;

	newButtonImportDeclarations.forEach((newButtonImport) => {
		if (!newButtonImport.value.specifiers) {
			return;
		}
		newButtonImport.value.specifiers.map((specifier) => {
			if (
				specifier.type === 'ImportSpecifier' &&
				specifier.imported &&
				specifier.imported.name === NEW_BUTTON_VARIANTS['link']
			) {
				linkButtonDeclaration = newButtonImport;

				linkButtonSpecifier = specifier.local?.name || '';
			}
		});
	});

	if (!linkButtonSpecifier) {
		return source.toSource();
	}

	let hasLink = false;
	const allLinkButtons = source
		.find(j.JSXElement)
		.filter(
			(path) =>
				path.value.openingElement.name.type === 'JSXIdentifier' &&
				path.value.openingElement.name.name === linkButtonSpecifier,
		);

	allLinkButtons
		.filter(
			(path) =>
				findJSXAttributeWithValue(path.value.openingElement, 'appearance', 'link') ||
				findJSXAttributeWithValue(path.value.openingElement, 'appearance', 'subtle-link'),
		)
		.forEach((path) => {
			const hasSpacingNone = findJSXAttributeWithValue(
				path.value.openingElement,
				'spacing',
				'none',
			);
			if (!hasSpacingNone) {
				let oldAppearanceValue;
				j(path)
					.find(j.JSXAttribute)
					.filter((path) => {
						if (
							path.node.name.name === 'appearance' &&
							path.node.value?.type === 'StringLiteral' &&
							(path.node.value.value === 'subtle-link' || path.node.value.value === 'link')
						) {
							oldAppearanceValue = path.node.value.value;
							return true;
						}

						return false;
					})
					.replaceWith(j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral('subtle')));

				if (oldAppearanceValue) {
					const attribute = path.value.openingElement.attributes?.find(
						(node) => node.type === 'JSXAttribute' && node.name.name === 'appearance',
					);
					if (attribute) {
						addCommentBefore(
							j,
							j(attribute),
							oldAppearanceValue === 'link'
								? migrateButtonToSubtleLinkButton
								: migrateSubtleButtonToSubtleLinkButton,
							'line',
						);
					}
				}
			}

			if (hasSpacingNone) {
				const { attributes } = path.node.openingElement;

				modifyLinkAttributes(path.node, j);

				j(path)
					.find(j.JSXAttribute)
					.filter((attribute) => {
						const isIconAttribute =
							attribute.node.name.name === 'iconBefore' || attribute.node.name.name === 'iconAfter';
						if (attribute.node.value?.type === 'JSXExpressionContainer' && isIconAttribute) {
							moveIconValueFromLinkButtonPropsToLinkChildren(
								j,
								path,
								attribute.node.value,
								attribute.node.name.name as 'iconBefore' | 'iconAfter',
							);
						}
						return isIconAttribute;
					})
					.remove();
				hasLink = true;
				j(path).replaceWith(
					j.jsxElement.from({
						openingElement: j.jsxOpeningElement(j.jsxIdentifier('Link'), attributes, false),
						closingElement: j.jsxClosingElement(j.jsxIdentifier('Link')),
						children: path.node.children,
					}),
				);
			}
		});

	// add link import and remove link button import if no link button is found
	if (hasLink && linkButtonDeclaration) {
		const linkImport = j.importDeclaration(
			[j.importDefaultSpecifier(j.identifier('Link'))],
			j.stringLiteral('@atlaskit/link'),
		);
		j(linkButtonDeclaration).insertAfter(linkImport);

		const remainingLinkButton = source
			.find(j.JSXElement)
			.filter(
				(path) =>
					path.value.openingElement.name.type === 'JSXIdentifier' &&
					path.value.openingElement.name.name === linkButtonSpecifier,
			);

		if (!remainingLinkButton.length) {
			j(linkButtonDeclaration)
				.find(j.ImportSpecifier)
				.filter((path) => path.node.imported.name === NEW_BUTTON_VARIANTS['link'])
				.remove();

			if ((linkButtonDeclaration as ASTPath<ImportDeclaration>).value.specifiers?.length === 0) {
				j(linkButtonDeclaration).remove();
			}
		}
	}

	return source.toSource(PRINT_SETTINGS);
}

export default transformer;
