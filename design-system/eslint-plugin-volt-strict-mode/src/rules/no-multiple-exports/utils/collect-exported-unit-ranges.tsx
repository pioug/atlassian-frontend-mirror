import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { type ExportedUnitRange } from './exported-unit-range';

/**
 * Collect the source ranges of the file's top-level runtime export declarations.
 * These are the subtrees the codemod would try to move into separate files, so a
 * binding referenced from 2+ of them is "shared" across the prospective split.
 *
 * Type-only exports (`export type`, `export interface`, `export enum`, and
 * `type`-qualified specifiers) are ignored — they never become their own runtime
 * module and so are irrelevant to sharing.
 */
export function collectExportedUnitRanges(program: TSESTree.Program): ExportedUnitRange[] {
	const units: ExportedUnitRange[] = [];

	for (const stmt of program.body) {
		if (stmt.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
			units.push({ range: stmt.range });
			continue;
		}

		if (stmt.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
			continue;
		}

		// Re-exports from another module (`export { x } from './y'`) do not carry a
		// local runtime body, so there is nothing to share.
		if (stmt.source != null) {
			continue;
		}
		if (stmt.exportKind === 'type') {
			continue;
		}

		if (stmt.declaration != null) {
			const decl = stmt.declaration;
			if (
				decl.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
				decl.type === AST_NODE_TYPES.TSTypeAliasDeclaration ||
				decl.type === AST_NODE_TYPES.TSEnumDeclaration
			) {
				continue;
			}
			units.push({ range: stmt.range });
			continue;
		}

		// `export { a, b }` — each non-type specifier is its own prospective unit.
		for (const spec of stmt.specifiers) {
			if (spec.type !== AST_NODE_TYPES.ExportSpecifier) {
				continue;
			}
			if (spec.exportKind === 'type') {
				continue;
			}
			units.push({ range: spec.range });
		}
	}

	return units;
}
