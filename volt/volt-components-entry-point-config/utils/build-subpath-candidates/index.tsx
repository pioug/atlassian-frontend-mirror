import type { LocatedPackage, SubpathCandidate } from '../../scripts/types';
import { barrelKeyToExportsKey } from '../barrel-key-to-exports-key';
import { exportsKeyToBarrelKey } from '../exports-key-to-barrel-key';
import { getExportedNames } from '../get-exported-names';
import { getUnderlyingSources } from '../get-underlying-sources';
import { normalizeExportTarget } from '../normalize-export-target';
import { resolvePackageRelativePath } from '../resolve-package-relative-path';

export function buildSubpathCandidates(
	pkg: LocatedPackage,
	barrelKeys: string[],
): SubpathCandidate[] {
	const exportsField = pkg.packageJson.exports;
	if (!exportsField) {
		return [];
	}

	const barrelExportKeys = new Set(barrelKeys.map(barrelKeyToExportsKey));
	const candidates: SubpathCandidate[] = [];

	for (const [exportsKey, target] of Object.entries(exportsField)) {
		if (exportsKey === './package.json') {
			continue;
		}
		if (barrelExportKeys.has(exportsKey) || exportsKey === './') {
			continue;
		}

		const relativeTarget = normalizeExportTarget(target);
		if (!relativeTarget) {
			continue;
		}

		const filePath = resolvePackageRelativePath(pkg.packageDir, relativeTarget);
		if (!filePath) {
			continue;
		}

		candidates.push({
			entryPoint: exportsKeyToBarrelKey(exportsKey),
			filePath,
			symbols: getExportedNames(filePath),
			underlyingSources: getUnderlyingSources(filePath),
		});
	}

	return candidates;
}
