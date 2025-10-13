/* eslint-disable @repo/internal/fs/filename-pattern-match */

import { AVAILABLE_ICON_NAMES, ICON_TO_OBJECT_NAME_MAPPINGS } from './constants';

/**
 * Converts a kebab-case string to PascalCase
 * @param str - The kebab-case string (e.g., 'new-feature', 'work-item')
 * @returns PascalCase string (e.g., 'NewFeature', 'WorkItem')
 */
export function kebabToPascalCase(str: string): string {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

/**
 * Extracts icon name and size from an icon-object import path
 * @param importPath - The import path like '@atlaskit/icon-object/glyph/new-feature/16'
 * @returns Object with iconName and size, or null if not a valid icon-object import
 */
export function parseIconObjectImport(importPath: string): {
	iconName: string;
	size: '16' | '24';
} | null {
	const match = importPath.match(/^@atlaskit\/icon-object\/glyph\/([^/]+)\/(16|24)$/);
	if (!match) {
		return null;
	}

	const [, iconName, size] = match;

	// Check if this is a valid icon name we support
	if (!AVAILABLE_ICON_NAMES.includes(iconName)) {
		return null;
	}

	return {
		iconName,
		size: size as '16' | '24',
	};
}

/**
 * Gets the new import specifier for an icon based on its name and size
 * @param iconName - The kebab-case icon name from icon-object (e.g., 'new-feature', 'issue')
 * @param size - The size ('16' or '24')
 * @returns Object with the new import path and component name
 */
export function getNewImportInfo(
	iconName: string,
	size: '16' | '24',
): {
	importPath: string;
	componentName: string;
} {
	// Check if this icon name needs to be mapped to a different object name
	const objectName = ICON_TO_OBJECT_NAME_MAPPINGS[iconName] || iconName;

	// Convert the object name to PascalCase
	const pascalCaseName = kebabToPascalCase(objectName);

	if (size === '16') {
		return {
			importPath: `@atlaskit/object/${objectName}`,
			componentName: `${pascalCaseName}Object`,
		};
	} else {
		return {
			importPath: `@atlaskit/object/tile/${objectName}`,
			componentName: `${pascalCaseName}ObjectTile`,
		};
	}
}

/**
 * Creates a new default import declaration for the transformed component
 */
export function createDefaultImportDeclaration(j: any, componentName: string, importPath: string) {
	const defaultSpecifier = j.importDefaultSpecifier(j.identifier(componentName));
	return j.importDeclaration([defaultSpecifier], j.stringLiteral(importPath));
}
