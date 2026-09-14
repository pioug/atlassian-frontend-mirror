import { type TSESLint, type TSESTree } from '@typescript-eslint/utils';

import { type ExportedUnitRange } from './exported-unit-range';
import { isContainedBy } from './is-contained-by';

/**
 * Count how many distinct exported units contain at least one reference to
 * `variable`. Used to decide whether a module-level binding (a Compiled style
 * value, or a mutable `let`/`var`) is shared across 2+ prospective split files.
 */
export function countExportedUnitsReferencing(
	variable: TSESLint.Scope.Variable,
	exportedUnits: ExportedUnitRange[],
): number {
	let count = 0;
	for (const unit of exportedUnits) {
		const referencedHere = variable.references.some((ref) => {
			const idNode = ref.identifier as TSESTree.Identifier;
			return idNode.range != null && isContainedBy(idNode.range, unit.range);
		});
		if (referencedHere) {
			count += 1;
		}
	}
	return count;
}
