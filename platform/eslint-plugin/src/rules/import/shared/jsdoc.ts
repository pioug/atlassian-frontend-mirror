import * as ts from 'typescript';

import { readFileContent } from './file-system';
import type { FileSystem } from './types';

/**
 * Matches a `@deprecated` JSDoc tag as a whole word, so it does not accidentally
 * match substrings like `@deprecatedFoo`.
 */
const DEPRECATED_TAG_REGEX = /@deprecated\b/;

/**
 * Determine whether an AST node is annotated `@deprecated`.
 *
 * Detection is intentionally lenient because the files we parse are standalone
 * `ts.SourceFile`s (no `Program`/type-checker):
 *
 * 1. Prefer the parsed JSDoc tags (`ts.getJSDocTags`). These are populated when the
 *    source file is created with `setParentNodes = true`, which every caller in this
 *    module does.
 * 2. Fall back to scanning the node's leading comment ranges for `@deprecated`. This
 *    is robust when JSDoc is not attached to the node kind (e.g. some export
 *    declarations) and when an unrelated block comment (like an `eslint-disable`)
 *    precedes the JSDoc.
 */
export function isNodeDeprecated(node: ts.Node, sourceText: string): boolean {
	try {
		const tags = ts.getJSDocTags(node);
		if (tags.some((tag) => tag.tagName.text === 'deprecated')) {
			return true;
		}
	} catch {
		// Ignore — fall back to comment scanning below.
	}

	const commentRanges = ts.getLeadingCommentRanges(sourceText, node.getFullStart());
	if (!commentRanges) {
		return false;
	}
	return commentRanges.some((range) =>
		DEPRECATED_TAG_REGEX.test(sourceText.slice(range.pos, range.end)),
	);
}

/**
 * Check whether a named `ExportSpecifier` element is deprecated, considering both a
 * `@deprecated` tag on the individual element and on its enclosing export statement.
 */
function isExportSpecifierDeprecated({
	element,
	statement,
	sourceText,
}: {
	element: ts.ExportSpecifier;
	statement: ts.ExportDeclaration;
	sourceText: string;
}): boolean {
	return isNodeDeprecated(statement, sourceText) || isNodeDeprecated(element, sourceText);
}

/**
 * Parse a file and determine whether the given export name is exposed through a
 * `@deprecated` path.
 *
 * Covers the ways a symbol can be exported from a file:
 * - re-exports (`export { orig as name } from '...'` / `export { name }`),
 * - local declarations (`export const/function/class/interface/type/enum name`),
 * - default exports (`export default ...` / `export { default as name }`).
 *
 * Returns `false` when the file cannot be read/parsed or the name is not found — the
 * caller then treats the export as non-deprecated (the safe, behaviour-preserving
 * default).
 *
 * `reExportsOnly` distinguishes the two semantically different `@deprecated` tags:
 * - A tag on a **re-export** (`export { X } from '...'`) is a *path/shim* deprecation:
 *   "this entry point is going away; import `X` from the clean subpath instead". Such a
 *   subpath must not be chosen as a barrel-removal rewrite target.
 * - A tag on the **local declaration** (`export const/function/class X = ...`) is an
 *   *API* deprecation: the symbol itself is going away in favour of a different API.
 *   This says nothing about which import *path* to use, so it must NOT disqualify an
 *   otherwise-clean subpath from being a rewrite target.
 *
 * When `reExportsOnly` is `true`, only re-export statements/specifiers (and
 * `export { default as name } from '...'` re-exports) are considered; local
 * declarations and local `export default <expr>` assignments are ignored. Defaults to
 * `false`, which preserves the original behaviour of treating both kinds as deprecated.
 */
export function isExportNameDeprecatedInFile({
	filePath,
	exportName,
	fs,
	reExportsOnly = false,
}: {
	filePath: string;
	exportName: string;
	fs: FileSystem;
	reExportsOnly?: boolean;
}): boolean {
	const content = readFileContent({ filePath, fs });
	if (!content) {
		return false;
	}

	let sourceFile: ts.SourceFile;
	try {
		sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
	} catch {
		return false;
	}

	for (const statement of sourceFile.statements) {
		// Named exports: `export { name }` and `export { name } from '...'`.
		if (ts.isExportDeclaration(statement)) {
			if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
				for (const element of statement.exportClause.elements) {
					if (element.name.text !== exportName) {
						continue;
					}
					if (isExportSpecifierDeprecated({ element, statement, sourceText: content })) {
						return true;
					}
				}
			}
			continue;
		}

		// A local `export default <expr>` assignment is an API-level deprecation, not a
		// path/shim deprecation, so it is ignored when only re-exports are considered.
		// (`export { default as name } from '...'` is a re-export and is handled above.)
		if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
			if (!reExportsOnly && exportName === 'default' && isNodeDeprecated(statement, content)) {
				return true;
			}
			continue;
		}

		// Local declarations carry an *API* deprecation, which must not disqualify a clean
		// re-export path. Skip them entirely when only re-exports are considered.
		if (reExportsOnly) {
			continue;
		}

		// Local declarations carrying an `export` modifier.
		const modifiers =
			'modifiers' in statement && Array.isArray(statement.modifiers)
				? (statement.modifiers as ts.Modifier[])
				: [];
		const hasExportModifier = modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
		if (!hasExportModifier) {
			continue;
		}

		const isDefaultExport = modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);

		if (ts.isVariableStatement(statement)) {
			for (const declaration of statement.declarationList.declarations) {
				if (
					ts.isIdentifier(declaration.name) &&
					declaration.name.text === exportName &&
					isNodeDeprecated(statement, content)
				) {
					return true;
				}
			}
			continue;
		}

		if (
			ts.isFunctionDeclaration(statement) ||
			ts.isClassDeclaration(statement) ||
			ts.isInterfaceDeclaration(statement) ||
			ts.isTypeAliasDeclaration(statement) ||
			ts.isEnumDeclaration(statement)
		) {
			const declaredName = statement.name?.text;
			const matchesName =
				declaredName === exportName || (isDefaultExport && exportName === 'default');
			if (matchesName && isNodeDeprecated(statement, content)) {
				return true;
			}
		}
	}

	return false;
}
