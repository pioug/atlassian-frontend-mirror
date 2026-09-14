import { dirname, resolve } from 'path';

import { resolveExistingFile } from '../resolve-existing-file';

export function resolveRelativeImport(fromFile: string, importPath: string): string | null {
	if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
		return null;
	}
	return resolveExistingFile(resolve(dirname(fromFile), importPath));
}
