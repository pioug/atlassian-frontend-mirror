import type { TSESTree } from '@typescript-eslint/utils';

import type { BarrelExportEntry, BarrelSourceInfo } from '../barrel-sources';
import type { AugmentedSpecifier } from '../build-import-statement';
import { getImportedName } from '../get-imported-name';
import { getSpecifierKind, type SpecifierKind } from '../get-specifier-kind';

export type ClassifiedSpecifier = {
	spec: AugmentedSpecifier;
	kind: SpecifierKind;
	/**
	 * Full destination import path when a mapped entry-point exists
	 */
	destination?: string;
	/**
	 * The destination exports this symbol as `default`, so the rewrite must bind it
	 * as a default import rather than preserving the barrel's named form.
	 */
	isDefaultExport?: boolean;
	/**
	 * Name the destination exports this symbol under. Set whenever the destination uses a
	 * named export, since the barrel may have published it under a different name.
	 */
	entryPointName?: string;
	/**
	 * Has a config entry with an entry-point but is not reportable for the active readiness gate
	 */
	warnOnly?: boolean;
	/**
	 * In config but no entry-point mapped yet
	 */
	incomplete?: boolean;
};

/**
 * Which Stage of Volt readiness makes a mapped symbol reportable.
 * - `voltCompliant`: Stage 1 warn rule — report when `voltCompliant && !consumersMigrated`
 * - `consumersMigrated`: Stage 2 error rule — report when `consumersMigrated`
 */
export type ReadinessGate = 'voltCompliant' | 'consumersMigrated';

function isReportable(entry: BarrelExportEntry, gate: ReadinessGate): boolean {
	if (gate === 'consumersMigrated') {
		return entry.consumersMigrated;
	}
	return entry.voltCompliant && !entry.consumersMigrated;
}

/**
 * Classify each non-namespace specifier against the barrel export map:
 * autofixable, warn-only, incomplete mapping, or unmapped remainder.
 */
export function classifySpecifiers(
	node: TSESTree.ImportDeclaration,
	barrel: BarrelSourceInfo,
	gate: ReadinessGate = 'voltCompliant',
): ClassifiedSpecifier[] {
	const classified: ClassifiedSpecifier[] = [];

	for (const rawSpec of node.specifiers) {
		const spec = rawSpec as AugmentedSpecifier;
		if (spec.type === 'ImportNamespaceSpecifier') {
			continue;
		}

		const exportKey = spec.type === 'ImportDefaultSpecifier' ? 'default' : getImportedName(spec);
		const entry = barrel.exports[exportKey];
		const kind = getSpecifierKind(node, spec);

		if (!entry) {
			classified.push({ spec, kind });
			continue;
		}

		if (!entry['entry-point']) {
			classified.push({ spec, kind, incomplete: true });
			continue;
		}

		const destination = `${barrel.packageName}${entry['entry-point']}`;
		const isDefaultExport = entry.isDefaultExport === true;
		const entryPointName = isDefaultExport ? undefined : (entry.entryPointName ?? entry.name);

		if (isReportable(entry, gate)) {
			classified.push({ spec, kind, destination, isDefaultExport, entryPointName });
		} else {
			classified.push({
				spec,
				kind,
				destination,
				isDefaultExport,
				entryPointName,
				warnOnly: true,
			});
		}
	}

	return classified;
}
