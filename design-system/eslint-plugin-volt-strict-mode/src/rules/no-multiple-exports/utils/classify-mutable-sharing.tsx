import { type TSESLint, type TSESTree } from '@typescript-eslint/utils';

import { type ExportedUnitRange } from './exported-unit-range';
import { isContainedBy } from './is-contained-by';

/**
 * Count how many distinct exported units REASSIGN (write to) `variable`, directly
 * or through reachable private helpers, plus how
 * many READ it — directly, or transitively through the module-level helpers named
 * in `reacherNames`. A shared mutable module state (B2 / TS2632) requires at least
 * one exported unit to reassign the binding and 2+ distinct exported units to
 * depend on it overall — splitting then forks the singleton and reassigning an
 * imported binding is illegal.
 */
export function classifyMutableSharing(
	variable: TSESLint.Scope.Variable,
	exportedUnits: ExportedUnitRange[],
	moduleScope: TSESLint.Scope.Scope,
	reacherNames: Set<string>,
	writerReacherNames: Set<string>,
): { unitsReferencing: number; hasWriteInsideExport: boolean } {
	// Build a flat list of every reference to a module-level binding, tagged with
	// the referenced name, range, and whether it is a write. Each binding's own
	// `references` array spans all nested scopes (function bodies etc.), unlike
	// `moduleScope.references` which only holds top-level references.
	const allRefs: { name: string; range: readonly [number, number]; isWrite: boolean }[] = [];
	for (const v of moduleScope.variables) {
		for (const ref of v.references) {
			const idNode = ref.identifier as TSESTree.Identifier;
			if (idNode.range != null) {
				allRefs.push({ name: v.name, range: idNode.range, isWrite: ref.isWrite() });
			}
		}
	}

	let unitsReferencing = 0;
	let hasWriteInsideExport = false;

	for (const unit of exportedUnits) {
		let referencedHere = false;

		for (const ref of allRefs) {
			if (!isContainedBy(ref.range, unit.range)) {
				continue;
			}
			if (ref.name === variable.name) {
				// Direct reference to the mutable binding inside this export.
				referencedHere = true;
				if (ref.isWrite) {
					hasWriteInsideExport = true;
				}
			} else if (reacherNames.has(ref.name)) {
				// Indirect: the export references a module-level helper that
				// (transitively) touches the shared mutable binding.
				referencedHere = true;
				if (writerReacherNames.has(ref.name)) {
					hasWriteInsideExport = true;
				}
			}
		}

		if (referencedHere) {
			unitsReferencing += 1;
		}
	}

	return { unitsReferencing, hasWriteInsideExport };
}
