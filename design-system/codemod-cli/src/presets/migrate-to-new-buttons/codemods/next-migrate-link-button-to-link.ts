import {
	type JSXAttribute,
	type API,
	type FileInfo,
	type JSXOpeningElement,
	type JSXSpreadAttribute,
	type ASTPath,
	type ImportDeclaration,
} from 'jscodeshift';
import { getImportDeclaration } from '@hypermod/utils';

import { PRINT_SETTINGS, NEW_BUTTON_ENTRY_POINT, NEW_BUTTON_VARIANTS } from '../utils/constants';
import moveIconValueFromLinkButtonPropsToLinkChildren from '../utils/move-icon-value-from-link-button-to-link-children';
export default function (file: FileInfo, api: API) {
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

	const findJSXAttributeWithValue = (
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
				j(path)
					.find(j.JSXAttribute)
					.filter(
						(path) =>
							path.node.name.name === 'appearance' &&
							path.node.value?.type === 'StringLiteral' &&
							(path.node.value.value === 'subtle-link' || path.node.value.value === 'link'),
					)
					.replaceWith(j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral('subtle')));
			}

			if (hasSpacingNone) {
				j(path)
					.find(j.JSXAttribute)
					.filter(
						(path) =>
							(path.node.name.name === 'appearance' &&
								path.node.value?.type === 'StringLiteral' &&
								path.node.value.value === 'link') ||
							(path.node.name.name === 'spacing' &&
								path.node.value?.type === 'StringLiteral' &&
								path.node.value.value === 'none'),
					)
					.remove();
				j(path)
					.find(j.JSXAttribute)
					.filter(
						(path) =>
							path.node.name.name === 'appearance' &&
							path.node.value?.type === 'StringLiteral' &&
							path.node.value.value === 'subtle-link',
					)
					.replaceWith(j.jsxAttribute(j.jsxIdentifier('appearance'), j.stringLiteral('subtle')));

				j(path)
					.find(j.JSXOpeningElement)
					.filter(
						(path) =>
							path.node.name.type === 'JSXIdentifier' &&
							path.node.name.name === linkButtonSpecifier,
					)
					.forEach((path) => {
						hasLink = true;
						if (path.node.name.type === 'JSXIdentifier') {
							path.node.name.name = 'Link';
						}
					});
				j(path)
					.find(j.JSXClosingElement)
					.filter(
						(path) =>
							path.node.name.type === 'JSXIdentifier' &&
							path.node.name.name === linkButtonSpecifier,
					)
					.forEach((path) => {
						if (path.node.name.type === 'JSXIdentifier') {
							path.node.name.name = 'Link';
						}
					});

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
