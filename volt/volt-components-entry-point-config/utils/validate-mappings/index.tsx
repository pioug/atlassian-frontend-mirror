import type { EntryPointConfig } from '../../src/types';
import { barrelKeyToExportsKey } from '../barrel-key-to-exports-key';
import { getExportedNames } from '../get-exported-names';
import { hasStarReexport } from '../has-star-reexport';
import { locatePackage } from '../locate-package';
import { normalizeExportTarget } from '../normalize-export-target';
import { resolvePackageRelativePath } from '../resolve-package-relative-path';

export type MappingViolation = {
	packageName: string;
	barrelKey: string;
	symbolName: string;
	entryPoint: string;
	reason: string;
};

export type ValidationResult = {
	checked: number;
	skipped: number;
	violations: MappingViolation[];
};

/**
 * Assert every mapped symbol is actually reachable from its entry-point in the recorded
 * import form. This is deliberately independent of the resolver: it re-reads the entry-point
 * file from disk, so it catches bad hand-written overrides as well as resolver regressions.
 */
export function validateMappings(
	config: EntryPointConfig,
	nameIndex: Map<string, string>,
): ValidationResult {
	const violations: MappingViolation[] = [];
	let checked = 0;
	let skipped = 0;

	for (const [packageName, barrels] of Object.entries(config)) {
		const pkg = locatePackage(packageName, nameIndex);
		if (!pkg) {
			continue;
		}

		for (const [barrelKey, exportsMap] of Object.entries(barrels)) {
			for (const [symbolName, entry] of Object.entries(exportsMap)) {
				const entryPoint = entry['entry-point'];
				if (entryPoint === undefined) {
					continue;
				}

				const filePath = resolveEntryPointFile(pkg, entryPoint);
				if (!filePath) {
					violations.push({
						packageName,
						barrelKey,
						symbolName,
						entryPoint,
						reason: 'entry-point is not declared in package.json exports',
					});
					continue;
				}

				if (hasStarReexport(filePath)) {
					skipped += 1;
					continue;
				}

				const exported = getExportedNames(filePath);
				const expected = entry.isDefaultExport ? 'default' : (entry.entryPointName ?? entry.name);
				checked += 1;

				if (!exported.has(expected)) {
					violations.push({
						packageName,
						barrelKey,
						symbolName,
						entryPoint,
						reason: entry.isDefaultExport
							? 'recorded as a default export but entry-point has no default export'
							: `entry-point does not export "${expected}"`,
					});
				}
			}
		}
	}

	return { checked, skipped, violations };
}

function resolveEntryPointFile(
	pkg: NonNullable<ReturnType<typeof locatePackage>>,
	entryPoint: string,
): string | null {
	const target = pkg.packageJson.exports?.[barrelKeyToExportsKey(entryPoint)];
	if (!target) {
		return null;
	}

	const relativeTarget = normalizeExportTarget(target);
	if (!relativeTarget) {
		return null;
	}

	return resolvePackageRelativePath(pkg.packageDir, relativeTarget);
}
