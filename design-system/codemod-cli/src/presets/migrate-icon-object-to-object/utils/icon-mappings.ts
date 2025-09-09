/* eslint-disable @repo/internal/fs/filename-pattern-match */

import { ICON_NAME_MAPPINGS } from './constants';

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
	if (!ICON_NAME_MAPPINGS[iconName]) {
		return null;
	}

	return {
		iconName,
		size: size as '16' | '24',
	};
}

/**
 * Gets the new import specifier for an icon based on its name and size
 * @param iconName - The kebab-case icon name (e.g., 'new-feature')
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
	const pascalCaseName = ICON_NAME_MAPPINGS[iconName];

	if (size === '16') {
		return {
			importPath: `@atlaskit/object/${iconName}`,
			componentName: `${pascalCaseName}Object`,
		};
	} else {
		return {
			importPath: `@atlaskit/object/tile/${iconName}`,
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
