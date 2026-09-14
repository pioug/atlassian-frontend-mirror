import { join } from 'path';

import { resolveExistingFile } from '../resolve-existing-file';

export function resolvePackageRelativePath(
	packageDir: string,
	relativePath: string,
): string | null {
	const withoutDot = relativePath.startsWith('./') ? relativePath.slice(2) : relativePath;
	return resolveExistingFile(join(packageDir, withoutDot));
}
