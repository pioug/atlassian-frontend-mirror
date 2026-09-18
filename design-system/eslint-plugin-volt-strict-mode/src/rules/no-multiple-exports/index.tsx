import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';
import type { Node as ESTreeNode } from 'estree';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';
import { isImportBinding } from '../utils/is-import-binding';
import { isRootPackageBarrel } from '../utils/is-root-package-barrel';
import { lookupVariable } from '../utils/lookup-variable';
import { hasSharedCompiledStyles } from './detect-shared-compiled-styles';
import { hasSharedMutableModuleState } from './detect-shared-mutable-state';
import { collectExportedUnitRanges } from './utils/collect-exported-unit-ranges';
import { resolveModuleScope } from './utils/resolve-module-scope';

type Options = [{ allowPrimitiveExports?: boolean }?];

/**
 * Returns true if the variable declarator's initializer is a primitive literal
 * (string, number, boolean, template literal, or null/undefined), including
 * when the value is annotated with `as const`.
 */
function isPrimitiveLiteral(declarator: TSESTree.VariableDeclarator): boolean {
	let init = declarator.init;
	if (init == null) {
		return false;
	}
	// Unwrap `as X` / `satisfies X` wrappers (incl. nesting) to get at the value.
	while (
		init.type === AST_NODE_TYPES.TSAsExpression ||
		init.type === AST_NODE_TYPES.TSSatisfiesExpression
	) {
		init = (init as TSESTree.TSAsExpression | TSESTree.TSSatisfiesExpression).expression;
	}
	if (init.type === AST_NODE_TYPES.Literal) {
		return (
			typeof (init as TSESTree.Literal).value === 'string' ||
			typeof (init as TSESTree.Literal).value === 'number' ||
			typeof (init as TSESTree.Literal).value === 'boolean' ||
			(init as TSESTree.Literal).value === null
		);
	}
	if (init.type === AST_NODE_TYPES.TemplateLiteral) {
		return true;
	}
	// undefined is represented as an Identifier named "undefined"
	if (
		init.type === AST_NODE_TYPES.Identifier &&
		(init as TSESTree.Identifier).name === 'undefined'
	) {
		return true;
	}
	return false;
}

/**
 * Returns true if the variable declarator's initializer is a function
 * (arrow function or function expression), e.g. `export const build = () => {}`.
 *
 * Such "function-valued" constants are conceptually functions and DO count
 * toward the one-runtime-export limit. Plain data constants (objects, arrays,
 * `new`-expressions, calls, etc.) are intentionally NOT counted — they mirror
 * the `volt-no-multi-exports` codemod, which only ever extracts functions and
 * classes (function-valued consts included) into their own file and leaves data
 * consts, enums, primitives and types in place. Keeping the lint rule aligned
 * means it never flags a file the codemod would refuse to auto-split.
 */
function isFunctionValued(declarator: TSESTree.VariableDeclarator): boolean {
	let init = declarator.init;
	if (init == null) {
		return false;
	}
	// Unwrap `as X` / `satisfies X` wrappers, including nesting such as
	// `const f = (() => {}) as Fn` or `const f = (() => {}) satisfies Fn`.
	// Mirrors `unwrapToIdentifier` in the `no-re-exports` rule so a function-valued
	// const cannot escape the one-export limit by adding a type assertion.
	while (
		init.type === AST_NODE_TYPES.TSAsExpression ||
		init.type === AST_NODE_TYPES.TSSatisfiesExpression
	) {
		init = (init as TSESTree.TSAsExpression | TSESTree.TSSatisfiesExpression).expression;
	}
	return (
		init.type === AST_NODE_TYPES.ArrowFunctionExpression ||
		init.type === AST_NODE_TYPES.FunctionExpression
	);
}

type NodeWithParent = TSESTree.Node & { parent?: TSESTree.Node };

const MUTATING_COLLECTION_METHODS = new Set([
	'add',
	'clear',
	'copyWithin',
	'delete',
	'fill',
	'pop',
	'push',
	'reverse',
	'set',
	'shift',
	'sort',
	'splice',
	'unshift',
]);

function isWithin(node: TSESTree.Node, container: { range?: readonly [number, number] }): boolean {
	const range = container.range;
	return range != null && node.range[0] >= range[0] && node.range[1] <= range[1];
}

function isMutatingCollectionMethodCall(memberExpression: TSESTree.MemberExpression): boolean {
	if (
		memberExpression.computed ||
		memberExpression.property.type !== AST_NODE_TYPES.Identifier ||
		!MUTATING_COLLECTION_METHODS.has(memberExpression.property.name)
	) {
		return false;
	}

	const parent = (memberExpression as NodeWithParent).parent;
	return parent?.type === AST_NODE_TYPES.CallExpression && parent.callee === memberExpression;
}

function isMutatedReference(reference: TSESLint.Scope.Reference): boolean {
	if (reference.isWrite()) {
		return true;
	}

	let node = reference.identifier as NodeWithParent;
	while (node.parent != null) {
		const parent = node.parent;
		if (
			(parent.type === AST_NODE_TYPES.MemberExpression &&
				parent.object === node &&
				isMutatingCollectionMethodCall(parent)) ||
			(parent.type === AST_NODE_TYPES.AssignmentExpression && isWithin(node, parent.left)) ||
			(parent.type === AST_NODE_TYPES.UpdateExpression && isWithin(node, parent.argument)) ||
			(parent.type === AST_NODE_TYPES.UnaryExpression &&
				parent.operator === 'delete' &&
				isWithin(node, parent.argument))
		) {
			return true;
		}
		node = parent as NodeWithParent;
	}

	return false;
}

/**
 * A module with exports that share mutable module-local state cannot be safely
 * split into one-export files without first redesigning that state boundary.
 * Do not issue a misleading one-export-per-file diagnostic for those modules.
 */
function hasSharedMutableState(
	program: TSESTree.Program,
	parts: ESTreeNode[],
	programScope: TSESLint.Scope.Scope,
): boolean {
	const moduleScope =
		programScope.childScopes.find((scope) => scope.type === 'module') ?? programScope;

	for (const statement of program.body) {
		if (statement.type !== AST_NODE_TYPES.VariableDeclaration || statement.kind === 'const') {
			continue;
		}

		for (const declarator of statement.declarations) {
			if (declarator.id.type !== AST_NODE_TYPES.Identifier) {
				continue;
			}

			const variable = lookupVariable(moduleScope, declarator.id.name);
			if (variable == null) {
				continue;
			}

			const partsUsingVariable = new Set<ESTreeNode>();
			let isMutatedByExport = false;
			for (const reference of variable.references) {
				const part = parts.find((candidate) =>
					isWithin(reference.identifier as TSESTree.Node, candidate),
				);
				if (part == null) {
					continue;
				}
				partsUsingVariable.add(part);
				isMutatedByExport ||= isMutatedReference(reference);
			}

			if (isMutatedByExport && partsUsingVariable.size > 1) {
				return true;
			}
		}
	}

	return false;
}

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-multiple-exports',
		docs: {
			description:
				"Allows at most one runtime export per module so each file maps to a single bundler unit; `export type` / `export interface` are exempt. A package's root barrel entry point (`<pkg>/src/index.{ts,tsx,js,jsx}`) is fully exempt — it is the public API surface and may aggregate many exports.",
			recommended: true,
			severity: 'warn',
			// Enable `allowPrimitiveExports` in the shipped presets so the rule stays aligned with the
			// `volt-no-multi-exports` codemod: the codemod only extracts functions/classes and always
			// leaves primitive value consts (string/number/boolean/null/undefined/template literal) in
			// place, so a file with one function/class export plus any number of primitive exports must
			// not fail this rule.
			pluginConfig: { allowPrimitiveExports: true },
		},
		messages: {
			'no-multiple-exports':
				'Only one runtime export is permitted per file. One or more type exports do not violate this rule. See https://go.atlassian.com/volt-one-export-per-file for guidance, migration guidance and limited exemptions.',
		},
		schema: [
			{
				type: 'object',
				properties: {
					allowPrimitiveExports: {
						type: 'boolean',
						description:
							'When true, multiple exports of primitive values (strings, numbers, booleans) are allowed. Only complex exports like functions and components are restricted to one per file.',
					},
				},
				additionalProperties: false,
			},
		],
		type: 'problem',
	},
	create(context) {
		// A package's root barrel (`<pkg>/src/index.{ts,tsx,js,jsx}`) is the public
		// API entry point and legitimately aggregates many exports. Enforcing the
		// one-export-per-file limit there is counter-productive, so the file is
		// exempt wholesale. Returning an empty visitor disables the rule for this
		// file only.
		const filename = context.filename ?? context.getFilename();
		if (isRootPackageBarrel(filename)) {
			return {};
		}

		const options = (context.options as Options)[0] ?? {};
		const allowPrimitiveExports = options.allowPrimitiveExports ?? false;

		return {
			Program(node) {
				// True if `name` resolves to an imported binding in the current scope.
				// An `export { X }` / `export default X` where X is imported is a re-export
				// (import-then-export indirection) — that is the `no-re-exports` rule's
				// concern, NOT a local runtime declaration, so this rule must not count it.
				const isReExportedImport = (refNode: TSESTree.Identifier): boolean => {
					const variable = lookupVariable(
						getScope(context, refNode as unknown as ESTreeNode) as TSESLint.Scope.Scope,
						refNode.name,
					);
					return variable != null && isImportBinding(variable);
				};

				const parts: ESTreeNode[] = [];
				// Track function names already seen so TypeScript overload signatures
				// (multiple `export function foo(…)` declarations with the same name)
				// are counted as a single logical export.
				const exportedFunctionNames = new Set<string>();
				// Track the identifier names that have already been counted as a runtime
				// export so that a default export and a named export of the *same*
				// identifier (e.g. `export default Foo;` alongside `export { Foo };`) are
				// treated as a single logical export rather than two. Order-independent.
				const countedExportNames = new Set<string>();

				for (const stmt of node.body) {
					if (stmt.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
						// `export default <Identifier>;` re-exports an existing binding. If that
						// same identifier is (or will be) also exported by name, the two refer to
						// one logical export, so only count it once.
						const defaultDecl = stmt as TSESTree.ExportDefaultDeclaration;
						if (defaultDecl.declaration.type === AST_NODE_TYPES.Identifier) {
							const name = (defaultDecl.declaration as TSESTree.Identifier).name;
							// `export default X;` where X is imported is a re-export shim, not a
							// local runtime export — leave it to `no-re-exports`.
							if (isReExportedImport(defaultDecl.declaration as TSESTree.Identifier)) {
								continue;
							}
							if (countedExportNames.has(name)) {
								continue;
							}
							countedExportNames.add(name);
						}
						parts.push(stmt);
						continue;
					}

					if (stmt.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
						continue;
					}

					const named = stmt as TSESTree.ExportNamedDeclaration;

					// Re-exports from another module are handled by `no-re-exports`.
					if (named.source != null) {
						continue;
					}

					if (named.exportKind === 'type') {
						continue;
					}

					if (named.declaration) {
						const decl = named.declaration;
						if (
							decl.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
							decl.type === AST_NODE_TYPES.TSTypeAliasDeclaration ||
							decl.type === AST_NODE_TYPES.TSEnumDeclaration
						) {
							continue;
						}

						// TypeScript overload signatures: `export function foo(…)` with no body
						// (`TSDeclareFunction`) and the final implementation (`FunctionDeclaration`
						// with a body) all share the same function name. Treat the entire overload
						// group as a single logical export.
						if (
							decl.type === AST_NODE_TYPES.TSDeclareFunction ||
							decl.type === AST_NODE_TYPES.FunctionDeclaration
						) {
							const fnDecl = decl as TSESTree.TSDeclareFunction | TSESTree.FunctionDeclaration;
							const fnName = fnDecl.id?.name;
							if (fnName != null) {
								if (exportedFunctionNames.has(fnName)) {
									// Already counted this function name — it's an overload, skip it.
									continue;
								}
								exportedFunctionNames.add(fnName);
							}
						}

						// Record declared export names so a later aliased re-export of the same
						// local binding (`export { Foo as Bar }`) is recognised as a second name
						// for an already-counted export rather than a new runtime unit.
						if (
							(decl.type === AST_NODE_TYPES.FunctionDeclaration ||
								decl.type === AST_NODE_TYPES.TSDeclareFunction ||
								decl.type === AST_NODE_TYPES.ClassDeclaration) &&
							decl.id?.name != null
						) {
							countedExportNames.add(decl.id.name);
						}

						if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
							for (const declarator of decl.declarations) {
								const variableDeclarator = declarator as TSESTree.VariableDeclarator;
								if (variableDeclarator.id.type === AST_NODE_TYPES.Identifier) {
									countedExportNames.add(variableDeclarator.id.name);
								}
								// Function-valued consts (`const f = () => {}`) are conceptually
								// functions and always count toward the limit.
								if (isFunctionValued(variableDeclarator)) {
									parts.push(declarator as ESTreeNode);
									continue;
								}
								// Primitive value consts count only when the caller has NOT opted
								// into `allowPrimitiveExports` (preserves the option's meaning).
								if (isPrimitiveLiteral(variableDeclarator)) {
									if (!allowPrimitiveExports) {
										parts.push(declarator as ESTreeNode);
									}
									continue;
								}
								// Everything else is a plain data const (object, array, call,
								// `new`, etc.). The `volt-no-multi-exports` codemod leaves these in
								// place (it only extracts functions/classes), so to stay aligned we
								// do NOT count them — a file the codemod won't split must not fail
								// this rule.
							}
						} else {
							parts.push(decl as ESTreeNode);
						}
						continue;
					}

					for (const spec of named.specifiers) {
						if (spec.type !== AST_NODE_TYPES.ExportSpecifier) {
							continue;
						}
						const exportSpec = spec as TSESTree.ExportSpecifier;
						if (exportSpec.exportKind === 'type') {
							continue;
						}
						// A named export specifier keyed on its LOCAL binding. If that local
						// binding was already counted as an export — via a matching
						// `export default Foo;`, or via a declaration `export const/function/
						// class Foo` that is then re-exported under an alias
						// (`export { Foo as Bar }`, e.g. the codemod's "public API aliases
						// preserved from an eliminated entry-point") — it is a second name for
						// one logical export, not a new runtime unit, so skip it.
						if (exportSpec.local.type === AST_NODE_TYPES.Identifier) {
							const localName = exportSpec.local.name;
							// `import { X }; export { X };` re-exposes an imported binding — a
							// re-export (barrel/shim) owned by `no-re-exports`, not a local
							// runtime declaration. Do not count it toward the one-export limit.
							if (isReExportedImport(exportSpec.local)) {
								continue;
							}
							if (countedExportNames.has(localName)) {
								continue;
							}
							countedExportNames.add(localName);
						}
						parts.push(exportSpec as ESTreeNode);
					}
				}
				if (
					parts.length <= 1 ||
					hasSharedMutableState(
						node as unknown as TSESTree.Program,
						parts,
						getScope(context, node) as TSESLint.Scope.Scope,
					)
				) {
					return;
				}

				// B2/B3 codemod-unsplittable exemption.
				//
				// This rule is intentionally aligned with the `volt-no-multi-exports`
				// codemod: it must never flag a file the codemod would refuse to
				// auto-split. Two well-defined categories cannot be split:
				//   B3 — two or more exports share one module-level `@compiled` style
				//        value (Compiled styles can't cross module boundaries), and
				//   B2 — two or more exports share a reassignable module-level
				//        `let`/`var` singleton (splitting forks it and reassigning an
				//        imported binding is illegal — TS2632).
				// In both cases the codemod skips the split, so this rule must not
				// report. Detection is conservative: it only exempts when a single
				// binding is genuinely shared across 2+ prospective split units.
				const moduleScope = resolveModuleScope(
					getScope(context, node as unknown as ESTreeNode) as TSESLint.Scope.Scope,
				);
				const exportedUnits = collectExportedUnitRanges(node as TSESTree.Program);
				if (
					hasSharedCompiledStyles(node as TSESTree.Program, moduleScope, exportedUnits) ||
					hasSharedMutableModuleState(node as TSESTree.Program, moduleScope, exportedUnits)
				) {
					return;
				}

				for (let i = 1; i < parts.length; i++) {
					const part = parts[i];
					context.report({
						node: part,
						messageId: 'no-multiple-exports',
					});
				}
			},
		};
	},
});

export default rule;
