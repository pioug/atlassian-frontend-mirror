import { basename, dirname } from 'path';

import { pascalCase } from '../pascal-case';

/**
 * Suggested binding name for a default export based on the implementing file.
 */
export function suggestDefaultExportName(filePath: string | null, fallback: string): string {
	if (!filePath) {
		return fallback;
	}
	const base = basename(filePath).replace(/\.(tsx?|jsx?)$/, '');
	if (base === 'index') {
		return pascalCase(basename(dirname(filePath)));
	}
	return pascalCase(base);
}
