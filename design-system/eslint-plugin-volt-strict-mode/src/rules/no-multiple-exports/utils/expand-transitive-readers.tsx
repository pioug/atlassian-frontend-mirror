import { type TSESLint, type TSESTree } from '@typescript-eslint/utils';

import { isContainedBy } from './is-contained-by';

/**
 * Given a set of "seed" module-level binding names (e.g. the shared mutable
 * `let`, plus any helper already known to touch it), expand it to include every
 * OTHER module-level binding whose declaration subtree references a name already
 * in the set. Repeats to a fixed point so multi-hop indirection is covered
 * (`exportedFn → helperA → helperB → sharedLet`).
 *
 * This lets the B2 detector attribute an export that only reaches the shared
 * mutable state transitively — for example `adf-schema`'s `getCellDomAttrs`,
 * which calls a non-exported `getGlobalTheme()` that in turn reads the module
 * `let testGlobalTheme` — instead of requiring a direct reference in the export.
 *
 * `bindingRanges` maps each module-level binding name to the source range of its
 * declaration subtree, so we can tell whether one binding references another.
 */
export function expandTransitiveReaders(
	seedNames: Set<string>,
	moduleScope: TSESLint.Scope.Scope,
	bindingRanges: Map<string, readonly [number, number]>,
): Set<string> {
	const reachers = new Set(seedNames);
	// A reference to any binding lives in that binding's own `references` array
	// (which spans every scope, unlike `moduleScope.references` which only holds
	// top-level references). Build a flat list of every reference to a
	// module-level binding, tagged with the referenced name and source range.
	const allRefs: { name: string; range: readonly [number, number] }[] = [];
	for (const variable of moduleScope.variables) {
		for (const ref of variable.references) {
			const idNode = ref.identifier as TSESTree.Identifier;
			if (idNode.range != null) {
				allRefs.push({ name: variable.name, range: idNode.range });
			}
		}
	}

	let changed = true;
	while (changed) {
		changed = false;
		for (const variable of moduleScope.variables) {
			if (reachers.has(variable.name)) {
				continue;
			}
			const declRange = bindingRanges.get(variable.name);
			if (declRange == null) {
				continue;
			}
			// Does this binding's declaration subtree reference any name already in
			// the reacher set? If so, it (transitively) touches the shared state.
			const touchesReacher = allRefs.some(
				(ref) => reachers.has(ref.name) && isContainedBy(ref.range, declRange),
			);
			if (touchesReacher) {
				reachers.add(variable.name);
				changed = true;
			}
		}
	}
	return reachers;
}
