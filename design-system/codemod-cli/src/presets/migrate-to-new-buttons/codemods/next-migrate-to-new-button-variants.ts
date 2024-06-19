import {
	type API,
	type FileInfo,
	type ImportDefaultSpecifier,
	type ImportSpecifier,
} from 'jscodeshift';
import { addCommentBefore } from '@atlaskit/codemod-utils';
import { getDefaultImportSpecifierName } from '@hypermod/utils';

import {
	PRINT_SETTINGS,
	OLD_BUTTON_VARIANTS,
	NEW_BUTTON_VARIANTS,
	entryPointsMapping,
	OLD_BUTTON_ENTRY_POINT,
	NEW_BUTTON_ENTRY_POINT,
	linkButtonMissingHrefComment,
	buttonPropsNoLongerSupportedComment,
	unsupportedProps,
	loadingButtonComment,
} from '../utils/constants';
import getDefaultImports from '../utils/get-default-imports';
import getSpecifierNames from '../utils/get-specifier-names';
import { generateNewElement, handleIconAttributes } from '../utils/generate-new-button-element';
import { ifHasUnsupportedProps } from '../utils/has-unsupported-props';
import { checkIfVariantAlreadyImported } from '../utils/if-variant-already-imported';
import { renameDefaultButtonToLegacyButtonImport } from '../utils/rename-default-button-to-legacy-button';
import { migrateFitContainerIconButton } from '../utils/migrate-fit-container-icon-button';
import { importTypesFromNewEntryPoint } from '../utils/import-types-from-new-entry-point';
import { addCommentForCustomThemeButtons } from '../utils/add-comment-for-custom-theme-buttons';
import { addCommentForOverlayProp } from '../utils/add-comment-for-overlay-prop';

const transformer = (file: FileInfo, api: API): string => {
	const j = api.jscodeshift;
	const fileSource = j(file.source);

	addCommentForCustomThemeButtons(fileSource, j);

	// Find old buttons
	const oldButtonImports = fileSource
		.find(j.ImportDeclaration)
		.filter(
			(path) =>
				path.node.source.value === entryPointsMapping.Button ||
				path.node.source.value === entryPointsMapping.LoadingButton ||
				path.node.source.value === OLD_BUTTON_ENTRY_POINT,
		);

	if (!oldButtonImports.length) {
		return fileSource.toSource();
	}

	const oldDefaultDefaultImports = getDefaultImports(oldButtonImports, j);
	const oldDefaultImportSpecifiers = getSpecifierNames(oldDefaultDefaultImports);

	// Find new buttons
	const newButtonImports = fileSource
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === NEW_BUTTON_ENTRY_POINT);
	const newDefaultDefaultImports = getDefaultImports(newButtonImports, j);
	const newDefaultImportSpecifiers = getSpecifierNames(newDefaultDefaultImports);

	const loadingButtonDirectImportName = getDefaultImportSpecifierName(
		j,
		fileSource,
		entryPointsMapping.LoadingButton,
	);

	/**
	 * Which variants should be in this file?
	 *
	 * Any variants enabled here will be added to the final import statement.
	 * Initial values check if the variant is already imported in the file.
	 */
	let hasVariant = {
		defaultButton: checkIfVariantAlreadyImported(
			NEW_BUTTON_VARIANTS.default,
			NEW_BUTTON_ENTRY_POINT,
			fileSource,
			j,
			true,
		),
		linkButton: checkIfVariantAlreadyImported(
			NEW_BUTTON_VARIANTS.link,
			NEW_BUTTON_ENTRY_POINT,
			fileSource,
			j,
		),
		iconButton: checkIfVariantAlreadyImported(
			NEW_BUTTON_VARIANTS.icon,
			NEW_BUTTON_ENTRY_POINT,
			fileSource,
			j,
		),
		linkIconButton: checkIfVariantAlreadyImported(
			NEW_BUTTON_VARIANTS.linkIcon,
			NEW_BUTTON_ENTRY_POINT,
			fileSource,
			j,
		),
	};

	const oldButtonElements = fileSource.find(j.JSXElement).filter((path) => {
		return (
			path.value.openingElement.name.type === 'JSXIdentifier' &&
			(oldDefaultImportSpecifiers?.includes(path.value.openingElement.name.name) ||
				Object.values(OLD_BUTTON_VARIANTS).includes(path.value.openingElement.name.name))
		);
	});

	addCommentForOverlayProp(oldButtonElements, j);

	const oldButtonsWithoutUnsupportedProps = oldButtonElements.filter(
		(path) => !ifHasUnsupportedProps(path.value.openingElement.attributes),
	);

	oldButtonsWithoutUnsupportedProps.forEach((element) => {
		const { attributes } = element.value.openingElement;
		if (!attributes) {
			return;
		}

		const buttonAttributes = attributes.map(
			(node) => node.type === 'JSXAttribute' && node.name.name,
		);

		const hasHref = buttonAttributes.includes('href');
		const hasIcon =
			buttonAttributes.includes('iconBefore') || buttonAttributes.includes('iconAfter');
		const hasNoChildren = element.value.children?.length === 0;
		const isFitContainerIconButton =
			hasIcon && hasNoChildren && buttonAttributes.includes('shouldFitContainer');
		const isLinkIconButton = hasHref && hasIcon && hasNoChildren && !isFitContainerIconButton;
		const isLinkButton = hasHref && !isLinkIconButton;
		let isIconButton = !hasHref && hasIcon && hasNoChildren && !isFitContainerIconButton;
		const isDefaultButton =
			!isLinkButton && !isLinkIconButton && !isIconButton && !isFitContainerIconButton;
		const isDefaultVariantWithAnIcon =
			!isLinkIconButton && !isIconButton && !isFitContainerIconButton && hasIcon;

		const isLoadingButton =
			element.value.openingElement.name.type === 'JSXIdentifier' &&
			element.value.openingElement.name.name === loadingButtonDirectImportName;

		const linkAppearanceAttribute = attributes.find(
			(node) =>
				node.type === 'JSXAttribute' &&
				node.value?.type === 'StringLiteral' &&
				node?.name?.name === 'appearance' &&
				(node?.value?.value === 'link' || node?.value?.value === 'subtle-link'),
		);

		if (isDefaultVariantWithAnIcon) {
			handleIconAttributes(element.value, j);
		}

		if (isFitContainerIconButton) {
			const migratedToIconButton = migrateFitContainerIconButton(element, j);
			if (migratedToIconButton) {
				isIconButton = true;
			}
		}

		if (isLinkIconButton && !isLoadingButton) {
			hasVariant.linkIconButton = true;

			j(element).replaceWith(generateNewElement(NEW_BUTTON_VARIANTS.linkIcon, element.value, j));
		}

		if (isIconButton && !isLoadingButton) {
			hasVariant.iconButton = true;

			j(element).replaceWith(generateNewElement(NEW_BUTTON_VARIANTS.icon, element.value, j));
		}

		if (isLinkButton && !isLoadingButton) {
			hasVariant.linkButton = true;

			j(element).replaceWith(generateNewElement(NEW_BUTTON_VARIANTS.link, element.value, j));
		}

		if (isDefaultButton && !isLoadingButton) {
			hasVariant.defaultButton = true;

			j(element).replaceWith(
				generateNewElement(
					newDefaultImportSpecifiers?.length
						? // If new button already has a default import, use that incase it's aliased
							newDefaultImportSpecifiers[0]
						: NEW_BUTTON_VARIANTS.default,
					element.value,
					j,
				),
			);
		}

		if (isLoadingButton) {
			const newElement = generateNewElement(
				NEW_BUTTON_VARIANTS[isIconButton || isLinkIconButton ? 'icon' : 'default'],
				element.value,
				j,
			);

			if (isIconButton || isLinkIconButton) {
				hasVariant.iconButton = true;
			} else {
				hasVariant.defaultButton = true;

				// rename existing Button to LegacyButton
				const existingDefaultButtonSpecifier = fileSource
					.find(j.ImportDefaultSpecifier)
					.filter((path) => path.value.local?.name === NEW_BUTTON_VARIANTS.default);
				if (existingDefaultButtonSpecifier.length > 0) {
					fileSource
						.find(j.JSXElement)
						.filter(
							(path) =>
								path.value.openingElement.name.type === 'JSXIdentifier' &&
								path.value.openingElement.name.name === NEW_BUTTON_VARIANTS.default,
						)
						.forEach((element) => {
							// find all default <Button> JSX elements and replace with <LegacyButton>
							j(element).replaceWith(
								j.jsxElement(
									j.jsxOpeningElement(
										j.jsxIdentifier('LegacyButton'),
										element.value.openingElement.attributes,
										element.value.children?.length === 0,
									),
									element.value.children?.length === 0
										? null
										: j.jsxClosingElement(j.jsxIdentifier('LegacyButton')),
									element.value.children,
								),
							);
						});

					// rename Button to LegacyButton in all call expressions i.e. render(Button), find(Button)
					fileSource
						.find(j.CallExpression)
						.find(j.Identifier)
						.forEach((path) => {
							if (path.node.name === NEW_BUTTON_VARIANTS.default) {
								path.node.name = 'LegacyButton';
							}
						});

					// rename Button to LegacyButton in import declaration
					existingDefaultButtonSpecifier.forEach((specifier) =>
						j(specifier).replaceWith(j.importDefaultSpecifier(j.identifier('LegacyButton'))),
					);
				}
			}

			j(element).replaceWith(newElement);

			if (hasHref || linkAppearanceAttribute) {
				addCommentBefore(
					j,
					j(newElement),
					loadingButtonComment({ hasHref, hasLinkAppearance: Boolean(linkAppearanceAttribute) }),
					'block',
				);
			}
		} else if (!hasHref && linkAppearanceAttribute) {
			addCommentBefore(j, j(linkAppearanceAttribute), linkButtonMissingHrefComment, 'line');
		}
	});

	// modify import declarations
	let specifiers: (ImportDefaultSpecifier | ImportSpecifier)[] = [];
	[
		hasVariant.linkButton ? 'link' : null,
		hasVariant.iconButton ? 'icon' : null,
		hasVariant.linkIconButton ? 'linkIcon' : null,
	].forEach((variant) => {
		if (variant) {
			specifiers.push(j.importSpecifier(j.identifier(NEW_BUTTON_VARIANTS[variant])));
		}
	});

	const remainingDefaultButtons =
		fileSource
			.find(j.JSXElement)
			.filter(
				(path) =>
					path.value.openingElement.name.type === 'JSXIdentifier' &&
					Boolean(oldDefaultImportSpecifiers?.includes(path.value.openingElement.name.name)) &&
					!ifHasUnsupportedProps(path.value.openingElement.attributes),
			).length > 0 ||
		fileSource
			.find(j.CallExpression)
			.filter((path) =>
				path.node.arguments
					.map((argument) => argument.type === 'Identifier' && argument?.name)
					.some((name) => name && oldDefaultImportSpecifiers?.includes(name)),
			).length > 0;

	// Loading buttons map back to default imports
	if (
		loadingButtonDirectImportName &&
		oldDefaultImportSpecifiers?.includes(loadingButtonDirectImportName)
	) {
		fileSource
			// rename LoadingButton to Button in all call expressions i.e. render(LoadingButton), find(LoadingButton)
			.find(j.CallExpression)
			.find(j.Identifier)
			.forEach((path) => {
				if (path.node.name === loadingButtonDirectImportName) {
					path.node.name = NEW_BUTTON_VARIANTS.default;
				}
			});
	}

	// Only add the Button import if we found a default button, not icon only
	if (
		hasVariant.defaultButton ||
		(!specifiers.find((specifier) => specifier.type === 'ImportDefaultSpecifier') &&
			remainingDefaultButtons)
	) {
		specifiers.push(j.importDefaultSpecifier(j.identifier(NEW_BUTTON_VARIANTS.default)));
	}

	// update import path for types imports
	specifiers = importTypesFromNewEntryPoint(oldButtonImports, specifiers, j, fileSource);

	const oldButtonsWithUnsupportedProps = oldButtonElements.filter((path) =>
		ifHasUnsupportedProps(path.value.openingElement.attributes),
	);
	if (oldButtonsWithUnsupportedProps.length) {
		// add comment to all buttons with unsupported props: "component", "style", "css"
		oldButtonsWithUnsupportedProps.forEach((element) => {
			const attribute = element.value.openingElement.attributes?.find(
				(node) =>
					node.type === 'JSXAttribute' &&
					typeof node.name.name === 'string' &&
					unsupportedProps.includes(node.name.name),
			);
			if (attribute) {
				addCommentBefore(j, j(attribute), buttonPropsNoLongerSupportedComment, 'line');
			}
		});

		// rename all buttons with unsupported props to LegacyButton if default new button is imported
		if (specifiers.find((specifier) => specifier.type === 'ImportDefaultSpecifier')) {
			renameDefaultButtonToLegacyButtonImport(oldButtonImports, oldButtonsWithUnsupportedProps, j);
		}
	}

	if (specifiers.length) {
		const existingNewButtonImports = fileSource
			.find(j.ImportDeclaration)
			.filter((path) => path.node.source.value === NEW_BUTTON_ENTRY_POINT);

		let newButtonImport = j.importDeclaration(specifiers, j.stringLiteral(NEW_BUTTON_ENTRY_POINT));

		oldButtonImports.forEach((path) => {
			newButtonImport.comments = path?.node?.comments ? path.node.comments : undefined;
		});

		if (existingNewButtonImports.length) {
			existingNewButtonImports.forEach((path) => {
				// Merge specifiers from existing new button import with added specifiers
				const mergedSpecifiers = [
					...specifiers.filter((specifier) => {
						if (specifier.type !== 'ImportDefaultSpecifier') {
							return true;
						}

						// Ensure we don't add a duplicate default specifier if one is already imported
						return !path.node.specifiers?.find((s) => s.type === 'ImportDefaultSpecifier');
					}),
					...(path.node.specifiers ? path.node.specifiers : []),
				]
					// Filter duplicates
					.filter((specifier) => {
						if (specifier.type === 'ImportDefaultSpecifier') {
							return true;
						}

						const isAlreadyImported = specifiers.find(
							(s) => s.type === 'ImportSpecifier' && s.imported.name === specifier.local?.name,
						);

						return !isAlreadyImported;
					});

				newButtonImport = j.importDeclaration(
					mergedSpecifiers,
					j.stringLiteral(NEW_BUTTON_ENTRY_POINT),
				);
			});

			oldButtonImports.remove();
			existingNewButtonImports.replaceWith(newButtonImport);
		} else {
			oldButtonImports.replaceWith((_, index) => {
				// Only replace the first import
				if (index === 0) {
					return newButtonImport;
				}
				// Remove the rest
				return null;
			});
		}
	}

	// remove empty import declarations
	fileSource
		.find(j.ImportDeclaration)
		.filter(
			(path) =>
				(path.node.source.value === '@atlaskit/button' ||
					path.node.source.value === '@atlaskit/button/types') &&
				!!path.node.specifiers &&
				path.node.specifiers.length === 0,
		)
		.remove();

	addCommentForCustomThemeButtons(fileSource, j);

	return fileSource.toSource(PRINT_SETTINGS);
};

export default transformer;
