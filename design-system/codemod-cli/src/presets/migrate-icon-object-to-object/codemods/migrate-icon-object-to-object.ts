/* eslint-disable @repo/internal/fs/filename-pattern-match */
import type { API, FileInfo, ImportDeclaration, ImportDefaultSpecifier } from 'jscodeshift';

import { OLD_ICON_OBJECT_ENTRY_POINT, PRINT_SETTINGS } from '../utils/constants';
import {
	createDefaultImportDeclaration,
	getNewImportInfo,
	parseIconObjectImport,
} from '../utils/icon-mappings';

const transformer = (file: FileInfo, api: API): string => {
	const j = api.jscodeshift;
	const fileSource = j(file.source);

	// Find all icon-object imports
	const iconObjectImports = fileSource.find(j.ImportDeclaration).filter((path) => {
		const source = path.node.source.value;
		return typeof source === 'string' && source.startsWith(OLD_ICON_OBJECT_ENTRY_POINT);
	});

	if (!iconObjectImports.length) {
		return fileSource.toSource();
	}

	// Track import name mappings (old name -> new name) and new imports to create
	const importNameMappings = new Map<string, string>();
	const newImportsToCreate: Array<{ componentName: string; importPath: string }> = [];

	// Process each icon-object import
	iconObjectImports.forEach((importPath) => {
		const importDeclaration = importPath.node;
		const source = importDeclaration.source.value as string;

		const parsedImport = parseIconObjectImport(source);
		if (!parsedImport) {
			return; // Skip invalid imports
		}

		const { iconName, size } = parsedImport;
		const { importPath: newImportPath, componentName } = getNewImportInfo(iconName, size);

		// Get the current import name (could be default import or renamed)
		const defaultSpecifier = importDeclaration.specifiers?.find(
			(spec): spec is ImportDefaultSpecifier => spec.type === 'ImportDefaultSpecifier',
		);

		if (defaultSpecifier) {
			const currentImportName = defaultSpecifier.local?.name;
			if (currentImportName) {
				// Map the old import name to the new component name
				importNameMappings.set(currentImportName, componentName);

				// Track the new import to create
				newImportsToCreate.push({ componentName, importPath: newImportPath });
			}
		}
	});

	// Update JSX elements to use new component names
	importNameMappings.forEach((newName, oldName) => {
		fileSource
			.find(j.JSXElement)
			.filter((path) => {
				const openingElement = path.value.openingElement;
				return openingElement.name.type === 'JSXIdentifier' && openingElement.name.name === oldName;
			})
			.forEach((elementPath) => {
				const element = elementPath.value;

				// Update opening tag
				if (element.openingElement.name.type === 'JSXIdentifier') {
					element.openingElement.name.name = newName;
				}

				// Update closing tag if it exists
				if (element.closingElement?.name.type === 'JSXIdentifier') {
					element.closingElement.name.name = newName;
				}

				// For 24px icons (now object tiles), add size="small" prop
				if (newName.endsWith('ObjectTile')) {
					const attributes = element.openingElement.attributes;
					if (attributes) {
						// Add size="small" (24px icons should be small tiles)
						attributes.push(j.jsxAttribute(j.jsxIdentifier('size'), j.stringLiteral('small')));
					}
				}
			});
	});

	// Update other references (like in render calls, etc.)
	importNameMappings.forEach((newName, oldName) => {
		fileSource
			.find(j.Identifier)
			.filter((path) => path.node.name === oldName)
			.forEach((path) => {
				// Only update if it's not part of an import declaration or JSX element
				// (those are handled separately)
				const parent = path.parent;
				if (
					parent?.value?.type !== 'ImportDefaultSpecifier' &&
					parent?.value?.type !== 'JSXIdentifier'
				) {
					path.node.name = newName;
				}
			});
	});

	// Remove old icon-object imports
	iconObjectImports.remove();

	// Create new individual default imports
	const newImports: ImportDeclaration[] = newImportsToCreate.map(({ componentName, importPath }) =>
		createDefaultImportDeclaration(j, componentName, importPath),
	);

	// Insert new imports at the top of the file
	if (newImports.length > 0) {
		const firstImport = fileSource.find(j.ImportDeclaration).at(0);
		if (firstImport.length > 0) {
			// Insert before the first existing import
			// insertBefore adds in reverse order, so we need to reverse the array
			newImports.reverse().forEach((importDecl) => {
				firstImport.insertBefore(importDecl);
			});
		} else {
			// No existing imports, add at the top of the file
			const body = fileSource.find(j.Program).get('body');
			// For unshift, we also need to reverse to maintain correct order
			newImports.reverse().forEach((importDecl) => {
				body.unshift(importDecl);
			});
		}
	}

	return fileSource.toSource(PRINT_SETTINGS);
};

export default transformer;
