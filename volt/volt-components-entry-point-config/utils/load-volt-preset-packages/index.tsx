import { existsSync } from 'fs';
import { join } from 'path';

import type { PackageVoltReadiness } from '../../src/types';
import { readJsonFile } from '../read-json-file';

export type VoltPresetPackageEntry = {
	name: string;
	dir: string;
	voltc?: string;
	voltCompliant?: boolean;
	consumersMigrated?: boolean;
};

type VoltPresetPackagesFile = {
	packages: VoltPresetPackageEntry[];
};

/**
 * Relative path from the AFM repo root to the Volt hotspot preset list.
 */
export const VOLT_PRESET_PACKAGES_RELATIVE_PATH = 'platform/volt-preset-packages.json';

/**
 * Load the Volt preset package list and return a stable map of
 * published package name → Stage 1 / Stage 2 readiness.
 *
 * Uses each entry's on-disk `package.json` `name` when available so preset
 * typos (e.g. `@atlassian/atlassian-context` vs `@atlaskit/atlassian-context`)
 * resolve to the real published name.
 */
export function loadVoltPresetPackageMap(afmRoot: string): Record<string, PackageVoltReadiness> {
	const presetPath = join(afmRoot, VOLT_PRESET_PACKAGES_RELATIVE_PATH);
	const raw = readJsonFile(presetPath) as VoltPresetPackagesFile;

	if (!raw || !Array.isArray(raw.packages)) {
		throw new Error('Invalid volt-preset-packages.json: expected a `packages` array');
	}

	const result: Record<string, PackageVoltReadiness> = {};

	for (const entry of raw.packages) {
		const packageName = resolvePublishedPackageName(afmRoot, entry);
		result[packageName] = {
			voltCompliant: entry.voltCompliant === true,
			consumersMigrated: entry.consumersMigrated === true,
		};
	}

	const sorted: Record<string, PackageVoltReadiness> = {};
	for (const packageName of Object.keys(result).sort((left, right) => left.localeCompare(right))) {
		sorted[packageName] = result[packageName];
	}
	return sorted;
}

function resolvePublishedPackageName(afmRoot: string, entry: VoltPresetPackageEntry): string {
	const packageJsonPath = join(afmRoot, entry.dir, 'package.json');
	if (!existsSync(packageJsonPath)) {
		return entry.name;
	}

	const packageJson = readJsonFile(packageJsonPath) as { name?: string };
	if (typeof packageJson.name === 'string' && packageJson.name.length > 0) {
		return packageJson.name;
	}

	return entry.name;
}
