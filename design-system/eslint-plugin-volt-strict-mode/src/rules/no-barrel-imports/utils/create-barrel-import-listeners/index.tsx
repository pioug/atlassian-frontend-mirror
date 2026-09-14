import type { Rule } from 'eslint';

type BarrelImportListeners = {
	onImport: (node: Rule.Node) => void;
	onExport: (node: Rule.Node) => void;
};

/**
 * Shared listeners for Volt barrel import/export sources.
 *
 * Uses plain node-type listeners plus `barrelSourceMap` lookup inside the transformers
 * (O(1) per declaration). Do not register per-source esquery attribute selectors —
 * ESLint evaluates every attribute selector on every Import/ExportNamedDeclaration,
 * which dominated AFM lint time for these rules.
 */
export function createBarrelImportListeners({
	onImport,
	onExport,
}: BarrelImportListeners): Rule.RuleListener {
	return {
		ImportDeclaration: onImport,
		ExportNamedDeclaration: onExport,
	};
}
