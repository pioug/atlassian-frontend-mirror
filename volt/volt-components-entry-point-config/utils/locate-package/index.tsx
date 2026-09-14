import { dirname } from 'path';

import type { LocatedPackage } from '../../scripts/types';
import { readJsonFile } from '../read-json-file';

export function locatePackage(
	packageName: string,
	nameIndex: Map<string, string>,
): LocatedPackage | null {
	const packageJsonPath = nameIndex.get(packageName);
	if (!packageJsonPath) {
		return null;
	}

	const raw = readJsonFile(packageJsonPath);
	if (!isPackageJson(raw)) {
		return null;
	}

	return {
		name: packageName,
		packageDir: dirname(packageJsonPath),
		packageJsonPath,
		packageJson: raw,
	};
}

function isPackageJson(value: unknown): value is LocatedPackage['packageJson'] {
	return typeof value === 'object' && value !== null;
}
