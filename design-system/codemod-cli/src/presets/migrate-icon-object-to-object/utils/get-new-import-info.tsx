/* eslint-disable @repo/internal/fs/filename-pattern-match */

import { kebabToPascalCase } from './kebab-to-pascal-case';

/**
 * Mappings for icon-object names that change when migrating to object.
 * Key: old icon-object name (kebab-case)
 * Value: new object name (kebab-case)
 *
 * Use this when the icon name in icon-object doesn't match the object name.
 * For example, 'issue' icon-object becomes 'work-item' object.
 *
 * Icons not listed here will use their original name (converted to PascalCase automatically).
 */
const ICON_TO_OBJECT_NAME_MAPPINGS: Record<string, string> = {
	issue: 'work-item',
};

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
