/* eslint-disable @repo/internal/fs/filename-pattern-match */

import { ICON_TO_OBJECT_NAME_MAPPINGS } from './constants';
import { kebabToPascalCase } from './kebab-to-pascal-case';

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
