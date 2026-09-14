/**
 * An "exported unit" is a single top-level export declaration together with its
 * source range. Both the B2 (shared mutable module state) and B3 (shared
 * Compiled styles) detectors need to attribute a variable reference to the
 * export whose subtree contains it, so they can count how many distinct exports
 * depend on the same module-level binding.
 */
export type ExportedUnitRange = {
	/**
	 * Inclusive-exclusive `[start, end]` source range of the export subtree.
	 */
	range: readonly [number, number];
};
