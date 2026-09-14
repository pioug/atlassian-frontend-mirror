import type { PackageVoltReadiness } from '../../src/types';

/**
 * Serialize the package readiness map as a TypeScript module source string.
 */
export function serializePackageNamesModule(
	packageNames: Record<string, PackageVoltReadiness>,
): string {
	const body = Object.entries(packageNames)
		.map(([packageName, readiness]) => {
			return `\t'${packageName}': { voltCompliant: ${String(readiness.voltCompliant)}, consumersMigrated: ${String(readiness.consumersMigrated)} },`;
		})
		.join('\n');

	return [
		'/**',
		' * Package → Volt Stage 1 / Stage 2 readiness from',
		' * `platform/volt-preset-packages.json`.',
		' * `voltCompliant: true` means confident mappings may set per-symbol',
		' * `voltCompliant: true` (lint report + suggestion).',
		' * `consumersMigrated: true` is Stage 2 (reserved for future warn→error).',
		' *',
		' * Do not edit by hand — regenerate via:',
		' * `yarn workspace @atlaskit/volt-components-entry-point-config codegen`',
		' */',
		'export const PACKAGE_NAMES = {',
		body,
		'} as const;',
		'',
	].join('\n');
}
