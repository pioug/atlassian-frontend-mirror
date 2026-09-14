import { config } from '@atlaskit/volt-components-entry-point-config';

export type BarrelExportEntry = {
	'entry-point'?: string;
	/**
	 * The entry-point exposes this symbol as its default export, so the rewritten
	 * import must be a default import even when the barrel exported it by name.
	 */
	isDefaultExport?: boolean;
	/**
	 * Name the entry-point exports the symbol under, when the barrel renamed it.
	 */
	entryPointName?: string;
	name: string;
	type: 'component' | 'type' | 'value';
	voltCompliant: boolean;
	consumersMigrated: boolean;
};

export type BarrelExports = Record<string, BarrelExportEntry>;

export type BarrelSourceInfo = {
	packageName: string;
	barrelKey: string;
	exports: BarrelExports;
};

type EntryPointConfig = {
	[packageName: string]: {
		[barrelPath: string]: BarrelExports;
	};
};

/**
 * Exact import sources that correspond to known barrels in the entry-point config
 * (`packageName + barrelKey`, e.g. `@atlaskit/flag` or `@atlaskit/primitives/compiled`).
 */
export function buildBarrelSourceMap(
	entryPointConfig: EntryPointConfig = config as EntryPointConfig,
): Map<string, BarrelSourceInfo> {
	const map = new Map<string, BarrelSourceInfo>();

	for (const [packageName, barrels] of Object.entries(entryPointConfig)) {
		for (const [barrelKey, exports] of Object.entries(barrels)) {
			const source = `${packageName}${barrelKey}`;
			map.set(source, { packageName, barrelKey, exports });
		}
	}

	return map;
}

export const barrelSourceMap: Map<string, BarrelSourceInfo> = buildBarrelSourceMap();
