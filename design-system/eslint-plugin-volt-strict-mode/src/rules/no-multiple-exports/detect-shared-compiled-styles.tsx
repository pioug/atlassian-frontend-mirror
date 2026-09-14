import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

import { countExportedUnitsReferencing } from './utils/count-exported-units-referencing';
import { type ExportedUnitRange } from './utils/exported-unit-range';

/**
 * Compiled style factories. A module-level `const foo = css({...})` (or
 * `styled`, `keyframes`, `cssMap`) produces a `@compiled` value that cannot be
 * shared across module boundaries. When two or more of a file's runtime exports
 * reference the SAME such value, splitting the file would break Compiled, so the
 * `volt-no-multi-exports` codemod refuses to split it ("Skipping split … share
 * Compiled style value(s)"). This is the page's B3 category.
 */
const COMPILED_STYLE_SOURCES = new Set(['@compiled/react', '@atlaskit/css']);
const COMPILED_STYLE_FACTORIES = new Set(['css', 'styled', 'keyframes', 'cssMap']);

/**
 * Collect the LOCAL names that a Compiled style factory is imported under.
 * Handles aliases (`import { css as cssFn }`) and namespace imports
 * (`import * as compiled` → any `compiled.css(...)` call). Only imports from a
 * known Compiled source count, so a locally-defined `css` helper never matches.
 */
function collectCompiledFactoryLocalNames(program: TSESTree.Program): {
	directNames: Set<string>;
	namespaceNames: Set<string>;
} {
	const directNames = new Set<string>();
	const namespaceNames = new Set<string>();

	for (const stmt of program.body) {
		if (stmt.type !== AST_NODE_TYPES.ImportDeclaration) {
			continue;
		}
		const source = typeof stmt.source.value === 'string' ? stmt.source.value : '';
		if (!COMPILED_STYLE_SOURCES.has(source)) {
			continue;
		}
		for (const spec of stmt.specifiers) {
			if (spec.type === AST_NODE_TYPES.ImportSpecifier) {
				const importedName =
					spec.imported.type === AST_NODE_TYPES.Identifier ? spec.imported.name : undefined;
				if (importedName != null && COMPILED_STYLE_FACTORIES.has(importedName)) {
					directNames.add(spec.local.name);
				}
			} else if (spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier) {
				namespaceNames.add(spec.local.name);
			}
		}
	}

	return { directNames, namespaceNames };
}

/**
 * True if `node` is a call to a Compiled style factory, e.g. `css({...})`,
 * `keyframes({...})`, or a namespaced `compiled.css({...})`.
 */
function isCompiledStyleCall(
	node: TSESTree.Expression,
	directNames: Set<string>,
	namespaceNames: Set<string>,
): boolean {
	if (node.type !== AST_NODE_TYPES.CallExpression) {
		return false;
	}
	const callee = node.callee;
	// `css(...)` / `cssFn(...)`
	if (callee.type === AST_NODE_TYPES.Identifier) {
		return directNames.has(callee.name);
	}
	// `styled.div(...)` — callee is a member/call chain rooted at `styled`.
	// `compiled.css(...)` — namespace import member access.
	if (callee.type === AST_NODE_TYPES.MemberExpression) {
		let root: TSESTree.Expression = callee.object;
		while (root.type === AST_NODE_TYPES.MemberExpression) {
			root = root.object;
		}
		if (root.type === AST_NODE_TYPES.Identifier) {
			if (directNames.has(root.name)) {
				// e.g. `styled.div(...)` where `styled` is a Compiled import.
				return true;
			}
			if (namespaceNames.has(root.name)) {
				// e.g. `compiled.css(...)` / `compiled.styled.div(...)`.
				const property = callee.property;
				if (property.type === AST_NODE_TYPES.Identifier) {
					return COMPILED_STYLE_FACTORIES.has(property.name);
				}
			}
		}
	}
	return false;
}

/**
 * Detects the B3 shape: two or more of the file's runtime exports share a single
 * module-level Compiled style value. Returns true when such a shared value
 * exists, meaning the file cannot be auto-split and must be exempt.
 */
export function hasSharedCompiledStyles(
	program: TSESTree.Program,
	moduleScope: TSESLint.Scope.Scope,
	exportedUnits: ExportedUnitRange[],
): boolean {
	if (exportedUnits.length < 2) {
		return false;
	}

	const { directNames, namespaceNames } = collectCompiledFactoryLocalNames(program);
	if (directNames.size === 0 && namespaceNames.size === 0) {
		return false;
	}

	// Find module-level bindings whose initializer is a Compiled style call.
	const styleVariableNames = new Set<string>();
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
			if (
				declarator.id.type === AST_NODE_TYPES.Identifier &&
				declarator.init != null &&
				isCompiledStyleCall(declarator.init, directNames, namespaceNames)
			) {
				styleVariableNames.add(declarator.id.name);
			}
		}
	}

	if (styleVariableNames.size === 0) {
		return false;
	}

	// A style value is "shared" when 2+ exported units reference it.
	for (const styleName of styleVariableNames) {
		const variable = moduleScope.variables.find((v) => v.name === styleName);
		if (variable == null) {
			continue;
		}
		const usingUnits = countExportedUnitsReferencing(variable, exportedUnits);
		if (usingUnits >= 2) {
			return true;
		}
	}

	return false;
}
