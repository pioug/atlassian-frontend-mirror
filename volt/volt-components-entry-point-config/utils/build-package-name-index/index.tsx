import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

import { readJsonFile } from '../read-json-file';

const PACKAGE_JSON = 'package.json';

export function buildPackageNameIndex(packagesRoot: string): Map<string, string> {
	const index = new Map<string, string>();
	walkPackageJsonFiles(packagesRoot, (packageJsonPath) => {
		const raw = readJsonFile(packageJsonPath);
		if (!isNamedPackageJson(raw)) {
			return;
		}
		index.set(raw.name, packageJsonPath);
	});
	return index;
}

function walkPackageJsonFiles(rootDir: string, onFile: (packageJsonPath: string) => void): void {
	if (!existsSync(rootDir)) {
		return;
	}

	const entries = readdirSync(rootDir, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
			continue;
		}

		const fullPath = join(rootDir, entry.name);
		if (entry.isDirectory()) {
			walkPackageJsonFiles(fullPath, onFile);
			continue;
		}

		if (entry.isFile() && entry.name === PACKAGE_JSON) {
			onFile(fullPath);
		}
	}
}

function isNamedPackageJson(value: unknown): value is { name: string } {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof (value as { name?: unknown }).name === 'string'
	);
}
