import type {
	EntryPointConfig,
	EntryPointConfigOverrides,
	PackageVoltReadiness,
} from '../../src/types';

/**
 * Deep-merge overrides on top of generated config. Override fields win per symbol.
 * Package-level readiness is applied afterwards via `applyPackageReadinessGate`.
 */
export function mergeOverrides(
	generated: EntryPointConfig,
	overrides: EntryPointConfigOverrides,
): EntryPointConfig {
	const result: EntryPointConfig = { ...generated };

	for (const [packageName, overrideBarrels] of Object.entries(overrides)) {
		const baseBarrels = result[packageName] ?? {};
		result[packageName] = mergePackageBarrelMaps(baseBarrels, overrideBarrels);
	}

	return result;
}

/**
 * Apply package-level Volt readiness onto every symbol:
 * - Force `voltCompliant: false` when the package is not Stage 1 (preserves
 *   override entry-points while blocking suggestions until the package is ready).
 * - Stamp `consumersMigrated` from the package map (package-level wins).
 */
export function applyPackageReadinessGate(
	config: EntryPointConfig,
	packageReadiness: Record<string, PackageVoltReadiness>,
): EntryPointConfig {
	const result: EntryPointConfig = {};

	for (const [packageName, barrels] of Object.entries(config)) {
		const readiness = packageReadiness[packageName] ?? {
			voltCompliant: false,
			consumersMigrated: false,
		};
		const gatedBarrels: EntryPointConfig[string] = {};

		for (const [barrelKey, exportsMap] of Object.entries(barrels)) {
			const gatedExports: EntryPointConfig[string][string] = {};
			for (const [symbolName, entry] of Object.entries(exportsMap)) {
				gatedExports[symbolName] = {
					...entry,
					voltCompliant: readiness.voltCompliant ? entry.voltCompliant : false,
					consumersMigrated: readiness.consumersMigrated,
				};
			}
			gatedBarrels[barrelKey] = gatedExports;
		}
		result[packageName] = gatedBarrels;
	}

	return result;
}

type PackageBarrelMap = EntryPointConfig[string];
type BarrelExportMap = PackageBarrelMap[string];
type SymbolEntryPointConfig = BarrelExportMap[string];
type OverrideBarrelMap = EntryPointConfigOverrides[string];
type OverrideExportMap = OverrideBarrelMap[string];

function mergePackageBarrelMaps(
	base: PackageBarrelMap,
	override: OverrideBarrelMap,
): PackageBarrelMap {
	const result: PackageBarrelMap = { ...base };

	for (const [barrelKey, overrideExports] of Object.entries(override)) {
		const baseExports = result[barrelKey] ?? {};
		result[barrelKey] = mergeBarrelExportMaps(baseExports, overrideExports);
	}

	return result;
}

function mergeBarrelExportMaps(
	base: BarrelExportMap,
	override: OverrideExportMap,
): BarrelExportMap {
	const result: BarrelExportMap = { ...base };

	for (const [symbolName, overrideConfig] of Object.entries(override)) {
		const baseConfig = result[symbolName];
		result[symbolName] = mergeSymbolConfig(symbolName, baseConfig, overrideConfig);
	}

	return result;
}

function mergeSymbolConfig(
	symbolName: string,
	base: SymbolEntryPointConfig | undefined,
	override: Partial<SymbolEntryPointConfig>,
): SymbolEntryPointConfig {
	if (!base) {
		return {
			name: override.name ?? symbolName,
			type: override.type ?? 'value',
			voltCompliant: override.voltCompliant ?? false,
			consumersMigrated: override.consumersMigrated ?? false,
			...override,
		};
	}

	const merged: SymbolEntryPointConfig = {
		...base,
		...override,
	};

	if (override['entry-point'] === undefined && base['entry-point'] !== undefined) {
		merged['entry-point'] = base['entry-point'];
	}

	return merged;
}
