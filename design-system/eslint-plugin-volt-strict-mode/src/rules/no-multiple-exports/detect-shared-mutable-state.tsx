import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

import { classifyMutableSharing } from './utils/classify-mutable-sharing';
import { type ExportedUnitRange } from './utils/exported-unit-range';
import { expandTransitiveReaders } from './utils/expand-transitive-readers';

/**
 * Collect the declaration subtree range for every module-level binding
 * (`const`/`let`/`var`, whether or not it is exported). Used to trace which
 * helper references the shared mutable state so indirect readers can be resolved.
 */
function collectModuleBindingRanges(
	program: TSESTree.Program,
): Map<string, readonly [number, number]> {
	const ranges = new Map<string, readonly [number, number]>();
	for (const stmt of program.body) {
		let decl: TSESTree.VariableDeclaration | undefined;
		if (stmt.type === AST_NODE_TYPES.VariableDeclaration) {
			decl = stmt;
		} else if (
			stmt.type === AST_NODE_TYPES.ExportNamedDeclaration &&
			stmt.declaration?.type === AST_NODE_TYPES.VariableDeclaration
		) {
			decl = stmt.declaration;
		}
		if (decl == null) {
			continue;
		}
		for (const declarator of decl.declarations) {
			if (declarator.id.type === AST_NODE_TYPES.Identifier) {
				ranges.set(declarator.id.name, declarator.range);
			}
		}
	}
	return ranges;
}

/**
 * Detects the B2 shape: shared mutable module state (TS2632).
 *
 * A file exhibits B2 when a module-level `let`/`var` binding is a singleton that
 * is reassigned by at least one export and depended on by 2+ of the file's
 * runtime exports (directly, or transitively via non-exported module-level
 * helpers). Splitting such a file forks the singleton across the new modules, and
 * reassigning an imported binding is a TypeScript error (TS2632), so the
 * `volt-no-multi-exports` codemod refuses to split it ("Skipping split … reassign
 * shared mutable local(s) … (TS2632)"). The lint rule stays aligned by exempting
 * the file.
 *
 * Only `let`/`var` bindings qualify — the TS2632 error is specifically about
 * reassigning (not mutating) an imported binding, so a `const` object that is
 * mutated in place is intentionally NOT treated as B2 (its exports remain
 * splittable as far as TS2632 is concerned).
 */
export function hasSharedMutableModuleState(
	program: TSESTree.Program,
	moduleScope: TSESLint.Scope.Scope,
	exportedUnits: ExportedUnitRange[],
): boolean {
	if (exportedUnits.length < 2) {
		return false;
	}

	// Collect module-level `let`/`var` binding names.
	const mutableNames = new Set<string>();
	for (const stmt of program.body) {
		let decl: TSESTree.VariableDeclaration | undefined;
		if (stmt.type === AST_NODE_TYPES.VariableDeclaration) {
			decl = stmt;
		} else if (
			stmt.type === AST_NODE_TYPES.ExportNamedDeclaration &&
			stmt.declaration?.type === AST_NODE_TYPES.VariableDeclaration
		) {
			decl = stmt.declaration;
		}
		if (decl == null || decl.kind === 'const') {
			continue;
		}
		for (const declarator of decl.declarations) {
			if (declarator.id.type === AST_NODE_TYPES.Identifier) {
				mutableNames.add(declarator.id.name);
			}
		}
	}

	if (mutableNames.size === 0) {
		return false;
	}

	const bindingRanges = collectModuleBindingRanges(program);

	for (const name of mutableNames) {
		const variable = moduleScope.variables.find((v) => v.name === name);
		if (variable == null) {
			continue;
		}

		// Every module-level binding whose subtree (transitively) touches this
		// mutable var. An exported unit that references any of these — not just the
		// var itself — depends on the shared mutable state.
		const reacherNames = expandTransitiveReaders(new Set([name]), moduleScope, bindingRanges);

		const { unitsReferencing, hasWriteInsideExport } = classifyMutableSharing(
			variable,
			exportedUnits,
			moduleScope,
			reacherNames,
		);
		// Shared across 2+ exports AND reassigned inside at least one of them → TS2632
		// on split. This is the codemod-unsplittable B2 shape.
		if (unitsReferencing >= 2 && hasWriteInsideExport) {
			return true;
		}
	}

	return false;
}
