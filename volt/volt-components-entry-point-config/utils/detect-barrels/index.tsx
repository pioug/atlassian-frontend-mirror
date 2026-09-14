import type { DetectedBarrel, LocatedPackage } from '../../scripts/types';
import { barrelKeyToExportsKey } from '../barrel-key-to-exports-key';
import { exportsKeyToBarrelKey } from '../exports-key-to-barrel-key';
import { normalizeExportTarget } from '../normalize-export-target';
import { parseFileSymbols } from '../parse-file-symbols';
import { resolvePackageRelativePath } from '../resolve-package-relative-path';

/**
 * Identify barrel export keys to migrate away from:
 * - Always consider `.` when present.
 * - Consider nested keys that have child export keys (e.g. `./compiled` with `./compiled/*`).
 */
export function detectBarrels(pkg: LocatedPackage): DetectedBarrel[] {
	const exportsField = pkg.packageJson.exports;
	if (!exportsField) {
		return [];
	}

	const exportKeys = Object.keys(exportsField).filter((key) => key !== './package.json');
	const barrelKeys = new Set<string>();

	if (exportKeys.includes('.') || exportKeys.includes('./')) {
		barrelKeys.add('');
	}

	for (const key of exportKeys) {
		if (key === '.' || key === './' || key === './package.json') {
			continue;
		}
		if (!hasChildExportKeys(key, exportKeys)) {
			continue;
		}
		barrelKeys.add(exportsKeyToBarrelKey(key));
	}

	const barrels: DetectedBarrel[] = [];
	for (const barrelKey of barrelKeys) {
		const detected = loadBarrel(pkg, exportsField, barrelKey);
		if (detected) {
			barrels.push(detected);
		}
	}

	return barrels;
}

function loadBarrel(
	pkg: LocatedPackage,
	exportsField: NonNullable<LocatedPackage['packageJson']['exports']>,
	barrelKey: string,
): DetectedBarrel | null {
	const exportsKey = barrelKeyToExportsKey(barrelKey);
	const target = exportsField[exportsKey] ?? (barrelKey === '' ? exportsField['./'] : undefined);
	if (!target) {
		return null;
	}

	const relativeTarget = normalizeExportTarget(target);
	if (!relativeTarget) {
		return null;
	}

	const filePath = resolvePackageRelativePath(pkg.packageDir, relativeTarget);
	if (!filePath) {
		return null;
	}

	return {
		barrelKey,
		filePath,
		symbols: parseFileSymbols(filePath),
	};
}

function hasChildExportKeys(parentKey: string, exportKeys: string[]): boolean {
	const prefix = parentKey.endsWith('/') ? parentKey : parentKey + '/';
	return exportKeys.some((key) => key.startsWith(prefix));
}
