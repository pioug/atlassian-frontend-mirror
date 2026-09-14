import type { DetectedBarrel, SymbolMatch } from '../../scripts/types';
import type { EntryPointConfig, PackageVoltReadiness } from '../../src/types';
import { suggestDefaultExportName } from '../suggest-default-export-name';

export function toSymbolConfig(
	symbol: DetectedBarrel['symbols'][number],
	entryPoint: string | null,
	readiness: PackageVoltReadiness,
	match: SymbolMatch | null = null,
): EntryPointConfig[string][string][string] {
	const name =
		symbol.exportName === 'default'
			? suggestDefaultExportName(symbol.sourceFilePath, 'Default')
			: symbol.exportName;

	const base = {
		name,
		type: symbol.kind,
		// Stamp package-level flags even when unmapped so Stage 2 data is present.
		voltCompliant: readiness.voltCompliant,
		consumersMigrated: readiness.consumersMigrated,
	};

	if (!entryPoint) {
		return base;
	}

	return {
		'entry-point': entryPoint,
		...describeBinding(match, name),
		...base,
	};
}

/**
 * Record how to bind the symbol at its entry-point, but only where that differs from the
 * barrel's own form — an absent field means "same named export as the barrel".
 */
function describeBinding(
	match: SymbolMatch | null,
	name: string,
): { isDefaultExport?: true; entryPointName?: string } {
	if (!match) {
		return {};
	}

	if (match.shape === 'default') {
		return { isDefaultExport: true };
	}

	return match.exportedAs === name ? {} : { entryPointName: match.exportedAs };
}
