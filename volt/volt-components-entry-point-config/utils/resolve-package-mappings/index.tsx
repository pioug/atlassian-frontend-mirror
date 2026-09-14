import type {
	CodegenReport,
	DetectedBarrel,
	LocatedPackage,
	SubpathCandidate,
} from '../../scripts/types';
import type { EntryPointConfig, PackageVoltReadiness } from '../../src/types';
import { filterCandidatesForBarrel } from '../filter-candidates-for-barrel';
import { resolveSymbol } from '../resolve-symbol';
import { toSymbolConfig } from '../to-symbol-config';

type ResolveResult = {
	barrelMap: EntryPointConfig[string];
	ambiguous: CodegenReport['ambiguous'];
	mappedCount: number;
	unmappedCount: number;
};

export function resolvePackageMappings(
	pkg: LocatedPackage,
	barrels: DetectedBarrel[],
	candidates: SubpathCandidate[],
	readiness: PackageVoltReadiness,
): ResolveResult {
	const barrelMap: EntryPointConfig[string] = {};
	const ambiguous: CodegenReport['ambiguous'] = [];
	let mappedCount = 0;
	let unmappedCount = 0;

	const nestedBarrelPrefixes = barrels
		.map((barrel) => barrel.barrelKey)
		.filter((key) => key !== '');

	for (const barrel of barrels) {
		const exportMap: EntryPointConfig[string][string] = {};
		const scopedCandidates = filterCandidatesForBarrel(
			candidates,
			barrel.barrelKey,
			nestedBarrelPrefixes,
		);

		for (const symbol of barrel.symbols) {
			const resolution = resolveSymbol(symbol, scopedCandidates);
			exportMap[symbol.exportName] = toSymbolConfig(
				symbol,
				resolution.entryPoint,
				readiness,
				resolution.match,
			);

			if (resolution.entryPoint) {
				mappedCount += 1;
				continue;
			}

			unmappedCount += 1;
			if (resolution.candidates.length > 1) {
				ambiguous.push({
					packageName: pkg.name,
					barrelKey: barrel.barrelKey,
					symbolName: symbol.exportName,
					candidates: resolution.candidates,
				});
			}
		}

		barrelMap[barrel.barrelKey] = exportMap;
	}

	return { barrelMap, ambiguous, mappedCount, unmappedCount };
}
