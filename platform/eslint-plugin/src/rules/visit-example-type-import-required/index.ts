import fs from 'fs';
import path from 'path';
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import { simpleTraverse } from '@typescript-eslint/typescript-estree';

export const RULE_NAME = 'visit-example-type-import-required';

const messages = {
	missingTypeofImport:
		'visitExample must use typeof import(...) generic type parameter. ' +
		'Use visitExample<typeof import("path/to/example.tsx")>(groupId, packageId, exampleId).',
	invalidTypeParameter:
		'visitExample generic type parameter must be a typeof import(...) expression.',
	pathMismatch:
		'The import path "{{ importPath }}" does not match the expected example file for ' +
		'visitExample({{ groupId }}, {{ packageId }}, {{ exampleId }}). ' +
		'Expected import to resolve to: {{ expectedPath }}',
	noPackageImports:
		'Package imports (e.g., @atlaskit/...) are not allowed in visitExample type parameters. Use a relative import path.',
	typeAliasNotInlined:
		'Type aliases for typeof import(...) must be inlined directly into the visitExample call. ' +
		'Use visitExample<typeof import("...")>(...) instead of defining a type alias.',
	suggestFixPath: 'Update import path to match visitExample arguments',
} satisfies Record<string, string>;

function isTargetFile(filename: string): boolean {
	return filename.endsWith('.spec.tsx');
}

/**
 * Extracts the import path string from a TSTypeQuery node of the form `typeof import('...')`.
 * Returns null if the node doesn't match that shape.
 */
function extractImportPathFromTypeQuery(typeQuery: TSESTree.TSTypeQuery): string | null {
	// TSTypeQuery { exprName: TSImportType { argument: TSLiteralType { literal: Literal } } }
	const { exprName } = typeQuery;
	if (exprName.type !== AST_NODE_TYPES.TSImportType) {
		return null;
	}
	const { argument } = exprName;
	if (
		argument.type === AST_NODE_TYPES.TSLiteralType &&
		argument.literal.type === AST_NODE_TYPES.Literal &&
		typeof argument.literal.value === 'string'
	) {
		return argument.literal.value;
	}
	return null;
}

type TypeAliasEntry = { node: TSESTree.TSTypeAliasDeclaration; isFileLevel: boolean };

/**
 * Builds a map of all TSTypeAliasDeclaration nodes in the file, keyed by name.
 * Each entry records whether the alias is at the top level of the program (file-level).
 */
function collectTypeAliases(ast: TSESTree.Program): Map<string, TypeAliasEntry> {
	const result = new Map<string, TypeAliasEntry>();

	// Cast through unknown to work around a version mismatch: @typescript-eslint/utils
	// vendors its own copy of @typescript-eslint/types (v7) while the root node_modules
	// has a different version (v5). The TSESTree types are structurally identical at
	// runtime — the cast is safe.
	simpleTraverse(ast as unknown as Parameters<typeof simpleTraverse>[0], {
		enter(node, parent) {
			// A type alias is "file-level" if its immediate parent is the Program,
			// or if it's the declaration of a top-level ExportNamedDeclaration.
			if (node.type === AST_NODE_TYPES.TSTypeAliasDeclaration) {
				const isFileLevel =
					parent?.type === AST_NODE_TYPES.Program ||
					parent?.type === AST_NODE_TYPES.ExportNamedDeclaration;
				result.set((node as unknown as TSESTree.TSTypeAliasDeclaration).id.name, {
					node: node as unknown as TSESTree.TSTypeAliasDeclaration,
					isFileLevel,
				});
			}
		},
	});

	return result;
}

/**
 * Resolves a top-level `const foo = 'literal'` declaration to its string value.
 * Returns null for non-const, non-string, or not-found variables.
 */
function resolveVariableToConstant(
	programBody: TSESTree.Statement[],
	variableName: string,
	cache: Map<string, string | null>,
): string | null {
	if (cache.has(variableName)) {
		return cache.get(variableName) ?? null;
	}

	for (const node of programBody) {
		if (node.type !== AST_NODE_TYPES.VariableDeclaration || node.kind !== 'const') {
			continue;
		}
		for (const declarator of node.declarations) {
			if (
				declarator.id.type === AST_NODE_TYPES.Identifier &&
				declarator.id.name === variableName &&
				declarator.init?.type === AST_NODE_TYPES.Literal &&
				typeof declarator.init.value === 'string'
			) {
				cache.set(variableName, declarator.init.value);
				return declarator.init.value;
			}
		}
	}

	cache.set(variableName, null);
	return null;
}

type CallArgs = { groupId: string; packageId: string; exampleId: string };

/**
 * Extracts the (groupId, packageId, exampleId) string arguments from a visitExample call.
 * Each argument may be a string literal or a reference to a top-level const string variable.
 * Returns null for any argument that can't be statically resolved.
 */
function extractCallArgs(
	node: TSESTree.CallExpression,
	programBody: TSESTree.Statement[],
	variableCache: Map<string, string | null>,
): CallArgs | null {
	if (node.arguments.length < 3) {
		return null;
	}

	function resolveArg(arg: TSESTree.CallExpressionArgument): string | null {
		if (arg.type === AST_NODE_TYPES.Literal && typeof arg.value === 'string') {
			return arg.value;
		}
		if (arg.type === AST_NODE_TYPES.Identifier) {
			return resolveVariableToConstant(programBody, arg.name, variableCache);
		}
		return null;
	}

	const groupId = resolveArg(node.arguments[0]);
	const packageId = resolveArg(node.arguments[1]);
	const exampleId = resolveArg(node.arguments[2]);

	if (!groupId || !packageId || !exampleId) {
		return null;
	}
	return { groupId, packageId, exampleId };
}

function getPackagesBasePath(
	testFilePath: string,
): { basePath: string; packagesIndex: number } | null {
	const testFileDir = path.dirname(testFilePath);
	const testFileSegments = testFileDir.split(path.sep);
	const packagesIndex = testFileSegments.findIndex((seg) => seg === 'packages');
	if (packagesIndex === -1) {
		return null;
	}

	const baseSegments = testFileSegments.slice(0, packagesIndex + 1);
	const basePath = path.isAbsolute(testFilePath)
		? path.resolve('/', ...baseSegments)
		: path.resolve(process.cwd(), ...baseSegments);

	return { basePath, packagesIndex };
}

/**
 * Resolves the expected example file path from visitExample arguments.
 *
 * visitExample('groupId', 'packageId', 'exampleId') maps to:
 *   packages/{groupId}/{packageId}/examples/{exampleId}.tsx
 *
 * Example files may also have a numeric sort prefix, e.g.:
 *   packages/{groupId}/{packageId}/examples/00-{exampleId}.tsx
 *
 * We scan the examples directory once and match against all candidates.
 * Falls back to the bare `{exampleId}.tsx` name when the directory can't
 * be read (e.g. in unit-test environments where the files don't exist).
 */
function resolveExamplePathFromArgs(
	groupId: string,
	packageId: string,
	exampleId: string,
	testFilePath: string,
): string | null {
	const packagesBase = getPackagesBasePath(testFilePath);
	if (!packagesBase) {
		return null;
	}

	const examplesDir = path.resolve(packagesBase.basePath, groupId, packageId, 'examples');
	const fallback = path.resolve(examplesDir, `${exampleId}.tsx`);

	// Match: exact name OR numeric-prefixed variant, with optional `.examples` infix
	const candidateRe = new RegExp(`^(?:\\d+-)?${exampleId}(?:\\.examples?)?\\.tsx$`);

	try {
		const match = fs.readdirSync(examplesDir).find((f) => candidateRe.test(f));
		if (match) {
			return path.resolve(examplesDir, match);
		}
	} catch {
		// Directory doesn't exist or can't be read (e.g. in test environments)
	}

	return fallback;
}

/**
 * Computes a relative import path from one file to another
 */
function computeRelativeImportPath(fromFile: string, toFile: string): string {
	const fromDir = path.dirname(fromFile);
	let relativePath = path.relative(fromDir, toFile);
	// Normalize to forward slashes for import statements (standard in JavaScript/TypeScript)
	relativePath = relativePath.replace(/\\/g, '/');
	// Ensure relative imports start with ./ or ../
	if (!relativePath.startsWith('.') && !relativePath.startsWith('/')) {
		relativePath = `./${relativePath}`;
	}
	return relativePath;
}

type GenericTypeInfo = { type: 'inline'; importPath: string } | { type: 'alias'; name: string };

/**
 * Extracts the generic type argument from a `visitExample<...>(...)` call expression
 * using the AST directly (no regex on source text).
 *
 * Returns:
 *   { type: 'inline', importPath } — for `visitExample<typeof import('...')>(...)`
 *   { type: 'alias', name }        — for `visitExample<SomeTypeAlias>(...)`
 *   null                           — if no generic type parameter is present
 */
function extractGenericType(node: TSESTree.CallExpression): GenericTypeInfo | null {
	// `typeArguments` is the current property name; `typeParameters` is the deprecated alias.
	// We fall back to `typeParameters` for compatibility with older parser versions.
	const params = (node.typeArguments ?? node.typeParameters)?.params ?? [];
	if (params.length === 0) {
		return null;
	}

	const [typeParam] = params;

	// `typeof import('...')` → TSTypeQuery { exprName: TSImportType { ... } }
	if (typeParam.type === AST_NODE_TYPES.TSTypeQuery) {
		const importPath = extractImportPathFromTypeQuery(typeParam);
		if (importPath !== null) {
			return { type: 'inline', importPath };
		}
	}

	// `SomeTypeAlias` → TSTypeReference { typeName: Identifier { name } }
	if (
		typeParam.type === AST_NODE_TYPES.TSTypeReference &&
		typeParam.typeName.type === AST_NODE_TYPES.Identifier
	) {
		return { type: 'alias', name: typeParam.typeName.name };
	}

	return null;
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Ensures that visitExample uses a typeof import(...) generic and that the import path matches the example file resolved from the call arguments.',
		},
		fixable: 'code',
		messages,
		schema: [],
	},
	create(context: Rule.RuleContext) {
		const filename = context.filename;

		const ast = context.sourceCode.ast as TSESTree.Program;
		const programBody = ast.body;

		// Build the type alias map once per file (lazily on first visitExample call)
		let typeAliases: Map<string, TypeAliasEntry> | null = null;
		function getTypeAliases(): Map<string, TypeAliasEntry> {
			if (!typeAliases) {
				typeAliases = collectTypeAliases(ast);
			}
			return typeAliases;
		}

		const variableCache = new Map<string, string | null>();

		return {
			CallExpression(estreeNode) {
				if (!isTargetFile(filename)) {
					return;
				}
				const node = estreeNode as TSESTree.CallExpression;
				// Only handle `<anything>.visitExample(...)` calls
				if (
					node.callee.type !== AST_NODE_TYPES.MemberExpression ||
					node.callee.property.type !== AST_NODE_TYPES.Identifier ||
					node.callee.property.name !== 'visitExample'
				) {
					return;
				}

				// Narrow callee — we've confirmed property is an Identifier above
				const callee = node.callee as TSESTree.MemberExpression & {
					property: TSESTree.Identifier;
				};
				// reportCallee is typed as estree.Node for context.report compatibility
				const reportCallee = estreeNode.callee;

				const genericType = extractGenericType(node);

				// ── Case 1: No generic type parameter ────────────────────────────────
				if (genericType === null) {
					const args = extractCallArgs(node, programBody, variableCache);
					context.report({
						node: reportCallee,
						messageId: 'missingTypeofImport',
						fix(fixer) {
							if (!args) {
								return null;
							}
							const examplePath = resolveExamplePathFromArgs(
								args.groupId,
								args.packageId,
								args.exampleId,
								filename,
							);
							if (!examplePath) {
								return null;
							}
							const importPath = computeRelativeImportPath(filename, examplePath);
							const [start, end] = callee.property.range!;
							return fixer.insertTextAfterRange([start, end], `<typeof import('${importPath}')>`);
						},
					});
					return;
				}

				// ── Case 2: Generic is a type alias reference (`visitExample<Foo>`) ──
				let importPath: string;
				if (genericType.type === 'alias') {
					const found = getTypeAliases().get(genericType.name);

					if (!found) {
						// Unknown type alias — not a typeof import
						context.report({ node: reportCallee, messageId: 'missingTypeofImport' });
						return;
					}

					if (found.isFileLevel) {
						// Top-level `type Foo = typeof import(...)` is disallowed
						context.report({ node: reportCallee, messageId: 'typeAliasNotInlined' });
						return;
					}

					const typeAnnotation = found.node.typeAnnotation;
					if (typeAnnotation.type !== AST_NODE_TYPES.TSTypeQuery) {
						context.report({ node: reportCallee, messageId: 'missingTypeofImport' });
						return;
					}
					const resolved = extractImportPathFromTypeQuery(typeAnnotation);
					if (!resolved) {
						context.report({ node: reportCallee, messageId: 'missingTypeofImport' });
						return;
					}
					importPath = resolved;
				} else {
					// ── Case 3: Inline `typeof import('...')` ────────────────────────
					importPath = genericType.importPath;
				}

				// Package-scoped imports (e.g. @atlaskit/foo/examples/...) are not allowed
				if (importPath.startsWith('@')) {
					context.report({ node: reportCallee, messageId: 'noPackageImports' });
					return;
				}

				// Validate that the import path matches the arguments
				const args = extractCallArgs(node, programBody, variableCache);
				if (!args) {
					// Dynamic arguments — can't validate statically
					return;
				}

				const expectedPath = resolveExamplePathFromArgs(
					args.groupId,
					args.packageId,
					args.exampleId,
					filename,
				);
				if (!expectedPath) {
					return;
				}

				const resolvedImport = path.normalize(path.resolve(path.dirname(filename), importPath));
				const resolvedExpected = path.normalize(expectedPath);

				// Compare without extensions so `.tsx` vs no extension doesn't matter
				if (
					resolvedImport.replace(/\.(tsx?|jsx?)$/, '') !==
					resolvedExpected.replace(/\.(tsx?|jsx?)$/, '')
				) {
					context.report({
						node: estreeNode.arguments[0],
						messageId: 'pathMismatch',
						data: {
							importPath,
							groupId: args.groupId,
							packageId: args.packageId,
							exampleId: args.exampleId,
							expectedPath: resolvedExpected,
						},
						fix(fixer) {
							const correctedPath = computeRelativeImportPath(filename, resolvedExpected);
							const typeParams = node.typeArguments ?? node.typeParameters;
							if (!typeParams?.range) {
								return null;
							}
							return fixer.replaceTextRange(
								typeParams.range,
								`<typeof import('${correctedPath}')>`,
							);
						},
					});
				}
			},
		};
	},
};

export default rule;
