import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';
import type { SourceCode } from 'eslint';
import type { Node as ESTreeNode } from 'estree';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';
import { isImportBinding } from '../utils/is-import-binding';
import { isRootPackageBarrel } from '../utils/is-root-package-barrel';
import { lookupVariable } from '../utils/lookup-variable';
import { isThirdPartyModule } from '../utils/is-third-party-module';

const DEPRECATED_TAG = '@deprecated';

/**
 * True if `text` contains a genuine `@deprecated` JSDoc tag. Matches the Rust
 * `export_shape` detection (`comment_has_deprecated_tag`): the tag must be
 * followed by a non-identifier character (or end of string), so lookalikes such
 * as `@deprecatedFoo` or `@deprecated_marker` do NOT match.
 */
function hasDeprecatedTag(text: string): boolean {
	let searchFrom = 0;
	for (;;) {
		const idx = text.indexOf(DEPRECATED_TAG, searchFrom);
		if (idx === -1) {
			return false;
		}
		const after = text[idx + DEPRECATED_TAG.length];
		// `after === undefined` means the tag is at the very end of the comment.
		if (after === undefined || !/[A-Za-z0-9_]/.test(after)) {
			return true;
		}
		searchFrom = idx + DEPRECATED_TAG.length;
	}
}

/**
 * True if the given export statement carries an `@deprecated` JSDoc tag in a
 * leading comment. Such re-exports are intentional, temporary migration shims
 * (kept in place while consumers migrate off them) and are NOT reported —
 * mirroring how the Volt Rust tooling treats `@deprecated` re-export shims.
 *
 * Walks up from `node` to the nearest enclosing top-level export statement so
 * the check works whether we start from the declaration itself or from an inner
 * specifier/identifier.
 */
function hasDeprecatedReexportMarker(node: TSESTree.Node, sourceCode: SourceCode): boolean {
	let current: TSESTree.Node | undefined = node;
	while (current) {
		if (
			current.type === AST_NODE_TYPES.ExportAllDeclaration ||
			current.type === AST_NODE_TYPES.ExportNamedDeclaration ||
			current.type === AST_NODE_TYPES.ExportDefaultDeclaration
		) {
			const comments = sourceCode.getCommentsBefore(current as unknown as ESTreeNode);
			return comments.some((comment) => hasDeprecatedTag(comment.value));
		}
		current = current.parent as TSESTree.Node | undefined;
	}
	return false;
}

function unwrapToIdentifier(expression: TSESTree.Expression): TSESTree.Identifier | null {
	if (expression.type === AST_NODE_TYPES.Identifier) {
		return expression;
	}
	if (expression.type === AST_NODE_TYPES.TSAsExpression) {
		return unwrapToIdentifier(expression.expression);
	}
	if (expression.type === AST_NODE_TYPES.TSSatisfiesExpression) {
		return unwrapToIdentifier(expression.expression);
	}
	return null;
}

/**
 * True if a variable declarator's initializer is a primitive literal
 * (string/number/boolean/null/undefined/template literal, incl. `as const`).
 * Mirrors `no-multiple-exports` so both rules count runtime exports identically.
 */
function isPrimitiveLiteral(declarator: TSESTree.VariableDeclarator): boolean {
	let init = declarator.init;
	if (init == null) {
		return false;
	}
	// Unwrap `as X` / `satisfies X` wrappers (incl. nesting), consistent with
	// unwrapToIdentifier, so a type-asserted primitive isn't miscounted.
	while (
		init.type === AST_NODE_TYPES.TSAsExpression ||
		init.type === AST_NODE_TYPES.TSSatisfiesExpression
	) {
		init = (init as TSESTree.TSAsExpression | TSESTree.TSSatisfiesExpression).expression;
	}
	if (init.type === AST_NODE_TYPES.Literal) {
		const { value } = init as TSESTree.Literal;
		return (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean' ||
			value === null
		);
	}
	if (init.type === AST_NODE_TYPES.TemplateLiteral) {
		return true;
	}
	return (
		init.type === AST_NODE_TYPES.Identifier && (init as TSESTree.Identifier).name === 'undefined'
	);
}

/**
 * Counts the number of runtime (value) exports in a module, using the same
 * definition as `no-multiple-exports`: `export type`/`interface`/`enum`,
 * type-only specifiers and primitive-value consts do NOT count. `export ... from`
 * re-exports and `export *` are excluded here (they are handled by the dedicated
 * re-export branches and are not "re-exposed imports").
 *
 * This lets the import-re-exposure check exempt the common single-export shim
 * shape (`import X; export default X;` / `import { X }; export { X };`) while
 * still flagging a re-exposed import that sits ALONGSIDE other runtime exports.
 */
function countRuntimeExports(program: TSESTree.Program): number {
	let count = 0;
	for (const stmt of program.body) {
		if (stmt.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
			count += 1;
			continue;
		}
		if (stmt.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
			continue;
		}
		const named = stmt as TSESTree.ExportNamedDeclaration;
		// `export ... from '...'` is a source re-export, not a local runtime export.
		if (named.source != null || named.exportKind === 'type') {
			continue;
		}
		const decl = named.declaration;
		if (decl) {
			if (
				decl.type === AST_NODE_TYPES.TSTypeAliasDeclaration ||
				decl.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
				decl.type === AST_NODE_TYPES.TSEnumDeclaration
			) {
				continue;
			}
			if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
				for (const d of decl.declarations) {
					const vd = d as TSESTree.VariableDeclarator;
					if (isPrimitiveLiteral(vd)) {
						continue;
					}
					count += 1;
				}
				continue;
			}
			// function / class declaration
			count += 1;
			continue;
		}
		// `export { a, b, type C }` specifier list (no source): count runtime names.
		for (const spec of named.specifiers) {
			if (
				spec.type === AST_NODE_TYPES.ExportSpecifier &&
				(spec as TSESTree.ExportSpecifier).exportKind !== 'type'
			) {
				count += 1;
			}
		}
	}
	return count;
}

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-re-exports',
		docs: {
			description:
				"Disallows re-exporting symbols from other modules (barrel patterns and import-then-export indirection) so consumers and bundlers do not chase extra layers. A re-export whose leading comment carries an `@deprecated` JSDoc tag is exempt, so intentional temporary migration shims (e.g. Volt entry-point shims) can remain while consumers migrate off them. A package's root barrel entry point (`<pkg>/src/index.{ts,tsx,js,jsx}`) is also fully exempt — it is the public API surface and may re-export freely without an `@deprecated` marker.",
			recommended: true,
			severity: 'warn',
		},
		messages: {
			'no-re-exports':
				'Do not re-export from other modules or re-expose imports. Import from the original module at the call site instead.',
		},
		type: 'problem',
	},
	create(context) {
		// A package's root barrel (`<pkg>/src/index.{ts,tsx,js,jsx}`) is the public
		// API entry point whose entire purpose is to aggregate and re-export the
		// package's modules. Re-exports there are expected, so the file is exempt
		// wholesale — and, notably, without requiring a deprecation migration-shim
		// marker on each re-export. Returning an empty visitor disables the rule for
		// this file only.
		const filename = context.filename ?? context.getFilename();
		if (isRootPackageBarrel(filename)) {
			return {};
		}

		const sourceCode = context.sourceCode ?? context.getSourceCode();
		const externalSources = new Map<string, boolean>();
		function isExternalSource(source: string): boolean {
			if (!externalSources.has(source)) {
				externalSources.set(source, isThirdPartyModule(filename, source));
			}
			return externalSources.get(source) === true;
		}

		// A re-exposed import is only a problem when it is NOT the file's sole
		// runtime export. `import X; export default X;` (or `export { X }`) where X
		// is the only value export is a legitimate single-export module/shim and is
		// allowed; re-exposing an import alongside other runtime exports is a barrel
		// pattern and is reported.
		let runtimeExportCount = 0;

		function reExposureIsSoleExport(): boolean {
			return runtimeExportCount <= 1;
		}

		function report(node: ESTreeNode) {
			context.report({ node, messageId: 'no-re-exports' });
		}

		function reportIfImportedIdentifier(id: TSESTree.Identifier) {
			if (reExposureIsSoleExport()) {
				return;
			}
			const variable = lookupVariable(
				getScope(context, id as ESTreeNode) as TSESLint.Scope.Scope,
				id.name,
			);
			if (variable && isImportBinding(variable)) {
				if (
					variable.defs.some(
						(definition) =>
							definition.type === 'ImportBinding' &&
							definition.parent.type === AST_NODE_TYPES.ImportDeclaration &&
							isExternalSource(String(definition.parent.source.value)),
					)
				) {
					return;
				}
				report(id as ESTreeNode);
			}
		}

		return {
			Program(node) {
				runtimeExportCount = countRuntimeExports(node as TSESTree.Program);
			},

			ExportAllDeclaration(node) {
				if (
					isExternalSource(String((node as TSESTree.ExportAllDeclaration).source.value)) ||
					hasDeprecatedReexportMarker(node as TSESTree.Node, sourceCode)
				) {
					return;
				}
				report(node);
			},

			ExportNamedDeclaration(node) {
				const named = node as TSESTree.ExportNamedDeclaration;

				if (hasDeprecatedReexportMarker(named, sourceCode)) {
					return;
				}

				// Type-only re-exports carry no runtime cost and are exempt (matching
				// the Volt tooling): both the statement-level form
				// (`export type { X } from './y'`) and the case where every specifier
				// is inline type-only (`export { type X } from './y'`).
				if (named.exportKind === 'type') {
					return;
				}

				if (named.source != null) {
					if (isExternalSource(String(named.source.value))) {
						return;
					}
					// Report only if at least one specifier is a runtime (non-type)
					// re-export. `export { type A, type B } from './y'` is fully
					// type-only and exempt; `export {} from './y'` is a no-op and exempt.
					const hasRuntimeSpecifier = named.specifiers.some(
						(spec) =>
							spec.type === AST_NODE_TYPES.ExportSpecifier &&
							(spec as TSESTree.ExportSpecifier).exportKind !== 'type',
					);
					if (hasRuntimeSpecifier) {
						report(node);
					}
					return;
				}

				for (const spec of named.specifiers) {
					if (spec.type === AST_NODE_TYPES.ExportSpecifier) {
						const exportSpec = spec as TSESTree.ExportSpecifier;
						if (exportSpec.exportKind === 'type') {
							continue;
						}
						const local = exportSpec.local;
						if (local.type === AST_NODE_TYPES.Identifier) {
							reportIfImportedIdentifier(local);
						}
					}
				}

				const decl = named.declaration;
				if (!decl || decl.type !== AST_NODE_TYPES.VariableDeclaration) {
					return;
				}

				for (const declarator of decl.declarations) {
					if (!declarator.init) {
						continue;
					}
					const id = unwrapToIdentifier(declarator.init);
					if (id) {
						reportIfImportedIdentifier(id);
					}
				}
			},

			ExportDefaultDeclaration(node) {
				const exportDefault = node as TSESTree.ExportDefaultDeclaration;
				if (hasDeprecatedReexportMarker(exportDefault, sourceCode)) {
					return;
				}
				const arg = exportDefault.declaration;
				if (arg.type === AST_NODE_TYPES.Identifier) {
					reportIfImportedIdentifier(arg);
				}
			},
		};
	},
});

export default rule;
