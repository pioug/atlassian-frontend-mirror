import type { API, FileInfo } from 'jscodeshift';
import {
	PRINT_SETTINGS,
	entryPointsMapping,
	BUTTON_TYPES,
	NEW_BUTTON_ENTRY_POINT,
} from '../utils/constants';
import renameElements from '../utils/rename-elements';
import { getDefaultImportSpecifierName } from '@hypermod/utils';

const transformer = (file: FileInfo, api: API): string => {
	const j = api.jscodeshift;
	const fileSource = j(file.source);

	const buttonImports = fileSource
		.find(j.ImportDeclaration)
		.filter((path) => (path.node.source.value as string)?.includes('@atlaskit/button'));

	if (
		!buttonImports.length ||
		buttonImports.every((node) => node.node.source.value !== '@atlaskit/button')
	) {
		return fileSource.toSource(PRINT_SETTINGS);
	}

	buttonImports.forEach((node) => {
		const { specifiers, source } = node.node;

		// Return early if the import is not a named import
		if (
			[
				...Object.values(entryPointsMapping),
				NEW_BUTTON_ENTRY_POINT,
				'@atlaskit/button/types',
			].includes(source.value as string)
		) {
			return fileSource.toSource(PRINT_SETTINGS);
		}

		const defaultSpecifier = specifiers?.find(
			(specifier) => specifier.type === 'ImportDefaultSpecifier',
		);

		if (defaultSpecifier && defaultSpecifier.local) {
			const existingSpecifier = getDefaultImportSpecifierName(
				j,
				fileSource,
				entryPointsMapping.Button,
			);

			if (existingSpecifier) {
				renameElements(defaultSpecifier.local?.name, existingSpecifier, fileSource, j);
			} else {
				const newImport = j.importDeclaration(
					[j.importDefaultSpecifier(j.identifier(defaultSpecifier.local.name))],
					j.stringLiteral(entryPointsMapping.Button),
				);
				j(node).insertAfter(newImport);
			}
		}

		const namedSpecifiers = specifiers?.filter((specifier) => specifier.type === 'ImportSpecifier');

		const newTypeSpecifier = namedSpecifiers?.filter(
			(specifier) =>
				specifier.type === 'ImportSpecifier' &&
				(specifier.imported.name === 'Appearance' || specifier.imported.name === 'Spacing'),
		);

		const otherTypeSpecifiers = namedSpecifiers?.filter((specifier) =>
			BUTTON_TYPES.includes((specifier as any).imported.name),
		);

		if (newTypeSpecifier?.length) {
			const typeImport = j.importDeclaration(
				newTypeSpecifier,
				j.stringLiteral('@atlaskit/button/types'),
			);

			j(node).insertAfter(typeImport);
		}

		if (otherTypeSpecifiers?.length) {
			const typeImport = j.importDeclaration(
				otherTypeSpecifiers,
				j.stringLiteral('@atlaskit/button'),
			);

			j(node).insertAfter(typeImport);
		}

		if (namedSpecifiers?.length) {
			namedSpecifiers.forEach((specifier) => {
				if (
					specifier.local &&
					specifier.type === 'ImportSpecifier' &&
					specifier.local.name &&
					entryPointsMapping[specifier.imported.name]
				) {
					const existingSpecifier = getDefaultImportSpecifierName(
						j,
						fileSource,
						entryPointsMapping[specifier.imported.name],
					);

					if (existingSpecifier) {
						renameElements(specifier.local?.name, existingSpecifier, fileSource, j);
					} else {
						const newImport = j.importDeclaration(
							[j.importDefaultSpecifier(j.identifier(specifier.local.name))],
							j.stringLiteral(entryPointsMapping[specifier.imported.name]),
						);
						j(node).insertAfter(newImport);
					}
				}
			});
		}

		j(node).remove();
	});

	return fileSource.toSource(PRINT_SETTINGS);
};

export default transformer;
