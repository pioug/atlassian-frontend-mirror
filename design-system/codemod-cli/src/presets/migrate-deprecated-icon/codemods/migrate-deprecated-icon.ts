/* eslint-disable @repo/internal/fs/filename-pattern-match */
import type {
	API,
	ASTPath,
	FileInfo,
	ImportDeclaration,
	ImportDefaultSpecifier,
} from 'jscodeshift';

import { deprecatedCore as deprecatedIconLabCore } from '@atlaskit/icon-lab/deprecated-map';
import coreIconLabMetadata from '@atlaskit/icon-lab/metadata';
import { deprecatedCore as deprecatedIconCore } from '@atlaskit/icon/deprecated-map';
import { coreIconMetadata } from '@atlaskit/icon/metadata';

const extractIconName = (importPath: string) => {
	const match = importPath.match(/\/([^\/]+)$/);
	return match ? match[1] : '';
};

const getIconComponentName = (name: string) => {
	return name
		.split(/\W/)
		.map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
		.join('')
		.concat('Icon');
};

/**
 * Creates a new default import declaration for the transformed component
 */
const createDefaultImportDeclaration = (j: any, componentName: string, importPath: string) => {
	const defaultSpecifier = j.importDefaultSpecifier(j.identifier(componentName));
	return j.importDeclaration([defaultSpecifier], j.stringLiteral(importPath));
};

const PRINT_SETTINGS = {
	quote: 'single' as const,
	trailingComma: true,
};

const transformer = (file: FileInfo, api: API): string => {
	const j = api.jscodeshift;
	const fileSource = j(file.source);

	const deprecatedIcons = Object.keys(deprecatedIconCore);
	const deprecatedIconLabIcons = Object.keys(deprecatedIconLabCore);

	// Find all deprecated icon imports
	const deprecatedIconImports = fileSource.find(j.ImportDeclaration).filter((path) => {
		const source = path.node.source.value as string;

		//Extract icon name from import path
		const iconName = extractIconName(source as string);

		const isDeprecated =
			deprecatedIcons.includes(source) || deprecatedIconLabIcons.includes(source);

		const hasReplacement =
			!!coreIconMetadata[iconName]?.replacement || !!coreIconLabMetadata[iconName]?.replacement;

		return typeof source === 'string' && isDeprecated && hasReplacement;
	});

	if (!deprecatedIconImports.length) {
		return fileSource.toSource();
	}

	// Track import name mappings (old name -> new name) and new imports to create
	const importNameMappings = new Map<string, string>();
	const newImportsToCreate: Array<{
		componentName: string;
		importPath: string;
		oldImportPath: ASTPath<ImportDeclaration>;
	}> = [];

	// Process each icon-object import
	deprecatedIconImports.forEach((importPath) => {
		const importDeclaration = importPath.node;
		const source = importDeclaration.source.value as string;

		//Extract icon name from import path
		const iconName = extractIconName(source);
		const replacementIconInfo =
			coreIconMetadata[iconName]?.replacement ?? coreIconLabMetadata[iconName]?.replacement;

		if (!replacementIconInfo) {
			return; // No replacement found, skip
		}

		const replacementIconName = getIconComponentName(replacementIconInfo.name);
		const replacementIconImport = `${replacementIconInfo.location}/core/${replacementIconInfo.name}`;

		// Get the current import name (could be default import or renamed)
		const defaultSpecifier = importDeclaration.specifiers?.find(
			(spec): spec is ImportDefaultSpecifier => spec.type === 'ImportDefaultSpecifier',
		);

		if (defaultSpecifier) {
			const currentImportName = defaultSpecifier.local?.name;
			if (currentImportName) {
				// Map the old import name to the new component name
				importNameMappings.set(currentImportName, replacementIconName);

				// Track the new import to create
				newImportsToCreate.push({
					componentName: replacementIconName,
					importPath: replacementIconImport,
					oldImportPath: importPath,
				});
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

	// Create new individual default imports
	newImportsToCreate.forEach(({ componentName, importPath, oldImportPath }) => {
		const newImport = createDefaultImportDeclaration(j, componentName, importPath);
		oldImportPath.replace(newImport);
	});

	return fileSource.toSource(PRINT_SETTINGS);
};

export default transformer;
