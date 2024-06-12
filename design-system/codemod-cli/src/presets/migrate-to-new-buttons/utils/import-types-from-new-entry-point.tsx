import type {
	ImportDefaultSpecifier,
	ImportSpecifier,
	JSCodeshift,
	Collection,
	ImportDeclaration,
} from 'jscodeshift';

import { NEW_BUTTON_VARIANTS } from './constants';

export const importTypesFromNewEntryPoint = (
	buttonImports: Collection<ImportDeclaration>,
	specifiers: (ImportDefaultSpecifier | ImportSpecifier)[],
	j: JSCodeshift,
	fileSource: Collection<any>,
): (ImportDefaultSpecifier | ImportSpecifier)[] => {
	const buttonPropsTypeSpecifier = buttonImports
		.find(j.ImportSpecifier)
		.filter((path) => path.node.imported.name === 'ButtonProps');

	if (buttonPropsTypeSpecifier.length > 0) {
		let typeSpecifier!: ImportSpecifier;
		specifiers.forEach((specifier) => {
			if (specifier.type === 'ImportDefaultSpecifier') {
				typeSpecifier = j.importSpecifier(
					j.identifier(`${NEW_BUTTON_VARIANTS.default}Props`),
					j.identifier(buttonPropsTypeSpecifier.get(0).node.local.name),
				);
			} else {
				typeSpecifier = j.importSpecifier(
					j.identifier(`${specifier.imported.name}Props`),
					j.identifier(buttonPropsTypeSpecifier.get(0).node.local.name),
				);
			}
		});
		if (typeSpecifier) {
			// @ts-ignore
			typeSpecifier.importKind = 'type';
			specifiers.push(typeSpecifier);
		}
	}

	const appearanceAndSpacingTypeSpecifier = fileSource
		.find(j.ImportDeclaration)
		.filter(
			(path) =>
				path.node.source.value === '@atlaskit/button' ||
				path.node.source.value === '@atlaskit/button/types',
		)
		.find(j.ImportSpecifier)
		.filter(
			(path) => path.node.imported.name === 'Appearance' || path.node.imported.name === 'Spacing',
		);
	if (appearanceAndSpacingTypeSpecifier.length) {
		appearanceAndSpacingTypeSpecifier.forEach((specifier) => {
			// @ts-ignore
			specifier.node.importKind = 'type'; // make sure all type imports are prefixed with the `type` keyword
			specifiers.push(specifier.node); // add new Appearance and Spacing types to the new entrypoint
			j(specifier).remove(); // remove old one
		});
	}
	return specifiers;
};
