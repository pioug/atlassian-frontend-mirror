import fs from 'fs';
import path from 'path';
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

export const RULE_NAME = 'editor-example-type-import-required';

const EDITOR_LIBRA_IMPORT = '@af/editor-libra';
const NOT_LIBRA_IMPORT = './not-libra';

const messages = {
	missingExampleName:
		'Spec files importing from @af/editor-libra or ./not-libra must include exampleName with a ' +
		'typeof import type assertion in test.use(). ' +
		"Add: exampleName: 'testing' as keyof typeof import('../../../examples/testing.tsx') ",
	missingTypeAssertion:
		'exampleName must include a typeof import type assertion for the static import graph. ' +
		"Use: exampleName: '{{ value }}' as keyof typeof import('{{ expectedPath }}') ",
	pathMismatch:
		'The import path "{{ importPath }}" does not resolve to the expected example file ' +
		"for exampleName '{{ exampleName }}'. Expected: {{ expectedPath }}",
} satisfies Record<string, string>;

function isTargetFile(filename: string): boolean {
	return filename.endsWith('.spec.tsx') || filename.endsWith('.spec.ts');
}

function hasEditorLibraImport(ast: TSESTree.Program): boolean {
	return ast.body.some(
		(node) =>
			node.type === AST_NODE_TYPES.ImportDeclaration &&
			(node.source.value === EDITOR_LIBRA_IMPORT || node.source.value === NOT_LIBRA_IMPORT),
	);
}

/**
 * Resolves the example file path from the spec file's location and the example name.
 * Editor specs follow: packages/{groupId}/{packageId}/src/__tests__/playwright/*.spec.ts
 * Examples live at:    packages/{groupId}/{packageId}/examples/{exampleName}.tsx
 */
function resolveExamplePath(testFilePath: string, exampleName: string): string | null {
	const testFileDir = path.dirname(testFilePath);
	const segments = testFileDir.split(path.sep);
	const packagesIndex = segments.findIndex((seg) => seg === 'packages');
	if (packagesIndex === -1) {
		return null;
	}

	const groupId = segments[packagesIndex + 1];
	const packageId = segments[packagesIndex + 2];
	if (!groupId || !packageId) {
		return null;
	}

	const basePath = path.isAbsolute(testFilePath)
		? path.resolve('/', ...segments.slice(0, packagesIndex + 1))
		: path.resolve(process.cwd(), ...segments.slice(0, packagesIndex + 1));

	const examplesDir = path.resolve(basePath, groupId, packageId, 'examples');

	const candidateRe = new RegExp(`^(?:\\d+-)?${exampleName}(?:\\.examples?)?\\.tsx$`);
	try {
		const match = fs.readdirSync(examplesDir).find((f) => candidateRe.test(f));
		if (match) {
			return path.resolve(examplesDir, match);
		}
	} catch {
		// Directory doesn't exist (e.g. test environments)
	}

	return path.resolve(examplesDir, `${exampleName}.tsx`);
}

function computeRelativeImportPath(fromFile: string, toFile: string): string {
	const fromDir = path.dirname(fromFile);
	let relativePath = path.relative(fromDir, toFile);
	relativePath = relativePath.replace(/\\/g, '/');
	if (!relativePath.startsWith('.') && !relativePath.startsWith('/')) {
		relativePath = `./${relativePath}`;
	}
	return relativePath;
}

/**
 * Check if a property value has a `keyof typeof import(...)` type assertion.
 * Handles both:
 *   'name' as keyof typeof import('...')
 */
function extractTypeofImportPath(node: TSESTree.Expression): string | null {
	if (node.type !== AST_NODE_TYPES.TSAsExpression) {
		return null;
	}

	const typeAnnotation = node.typeAnnotation;

	if (
		typeAnnotation.type === AST_NODE_TYPES.TSTypeOperator &&
		typeAnnotation.operator === 'keyof'
	) {
		return extractFromTypeQuery(typeAnnotation.typeAnnotation);
	}

	if (typeAnnotation.type === AST_NODE_TYPES.TSUnionType) {
		for (const member of typeAnnotation.types) {
			if (member.type === AST_NODE_TYPES.TSTypeOperator && member.operator === 'keyof') {
				const result = extractFromTypeQuery(member.typeAnnotation);
				if (result) {
					return result;
				}
			}
		}
	}

	return null;
}

function extractFromTypeQuery(node: TSESTree.TypeNode | undefined): string | null {
	if (!node || node.type !== AST_NODE_TYPES.TSTypeQuery) {
		return null;
	}
	const { exprName } = node;
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

/**
 * Extract the string value from a property value, ignoring type assertions.
 */
function getStringValue(node: TSESTree.Expression): string | null {
	if (node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string') {
		return node.value;
	}
	if (node.type === AST_NODE_TYPES.TSAsExpression) {
		return getStringValue(node.expression as TSESTree.Expression);
	}
	return null;
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Ensures that editor spec files using @af/editor-libra include exampleName with a ' +
				'typeof import type assertion in test.use() for the static import graph (factsMap).',
		},
		fixable: 'code',
		messages,
		schema: [],
	},
	create(context: Rule.RuleContext) {
		const filename = context.filename;
		if (!isTargetFile(filename)) {
			return {};
		}

		const ast = context.sourceCode.ast as TSESTree.Program;
		if (!hasEditorLibraImport(ast)) {
			return {};
		}

		return {
			'Program:exit'(estreeNode) {
				const program = estreeNode as unknown as TSESTree.Program;

				// Collect all test.use() calls in the file in document order using a queue
				const testUseCalls: TSESTree.CallExpression[] = [];
				const visited = new Set<TSESTree.Node>();
				const queue: TSESTree.Node[] = [program];
				while (queue.length > 0) {
					const node = queue.shift()!;
					if (visited.has(node)) {
						continue;
					}
					visited.add(node);
					if (
						node.type === AST_NODE_TYPES.CallExpression &&
						node.callee.type === AST_NODE_TYPES.MemberExpression &&
						node.callee.property.type === AST_NODE_TYPES.Identifier &&
						node.callee.property.name === 'use' &&
						node.arguments.length > 0 &&
						node.arguments[0].type === AST_NODE_TYPES.ObjectExpression
					) {
						testUseCalls.push(node);
					}
					for (const key of Object.keys(node)) {
						if (key === 'parent') {
							continue;
						}
						const child = (node as any)[key];
						if (Array.isArray(child)) {
							for (const item of child) {
								if (item && typeof item.type === 'string') {
									queue.push(item);
								}
							}
						} else if (child && typeof child.type === 'string') {
							queue.push(child);
						}
					}
				}

				// Check if any test.use() call anywhere in the file has exampleName with a typeof import assertion
				const fileHasExampleName = testUseCalls.some((call) => {
					const obj = call.arguments[0] as TSESTree.ObjectExpression;
					return obj.properties.some((prop) => {
						if (
							prop.type !== AST_NODE_TYPES.Property ||
							prop.key.type !== AST_NODE_TYPES.Identifier ||
							prop.key.name !== 'exampleName'
						) {
							return false;
						}
						return extractTypeofImportPath(prop.value as TSESTree.Expression) !== null;
					});
				});

				if (fileHasExampleName) {
					return;
				}

				// Find the first test.use() call that has exampleName without the typeof import assertion
				// (if any), otherwise use the first test.use() call
				let targetCall = testUseCalls[0];
				let existingExampleNameProp: TSESTree.Property | null = null;

				for (const call of testUseCalls) {
					const obj = call.arguments[0] as TSESTree.ObjectExpression;
					const prop = obj.properties.find(
						(p): p is TSESTree.Property =>
							p.type === AST_NODE_TYPES.Property &&
							p.key.type === AST_NODE_TYPES.Identifier &&
							p.key.name === 'exampleName',
					);
					if (prop) {
						targetCall = call;
						existingExampleNameProp = prop;
						break;
					}
				}

				if (!targetCall) {
					return;
				}

				const objectArg = targetCall.arguments[0] as TSESTree.ObjectExpression;

				// Determine the example name to use for the import path
				const exampleNameValue = existingExampleNameProp
					? getStringValue(existingExampleNameProp.value as TSESTree.Expression)
					: null;
				const defaultName = exampleNameValue ?? 'testing';
				const examplePath = resolveExamplePath(filename, defaultName);
				if (!examplePath) {
					return;
				}
				const importPath = computeRelativeImportPath(filename, examplePath);

				context.report({
					node: targetCall as unknown as Rule.Node,
					messageId: 'missingExampleName',
					fix(fixer) {
						// If exampleName exists but lacks typeof import, replace its value
						if (existingExampleNameProp) {
							return fixer.replaceText(
								existingExampleNameProp.value as any,
								`'${defaultName}' as keyof typeof import('${importPath}') `,
							);
						}
						// Otherwise insert exampleName as the first property
						const firstProp = objectArg.properties[0];
						if (!firstProp) {
							return fixer.replaceText(
								targetCall.arguments[0] as any,
								`{\n\texampleName: '${defaultName}' as keyof typeof import('${importPath}'),\n}`,
							);
						}
						const sourceCode = context.sourceCode;
						const token = sourceCode.getFirstToken(firstProp as any);
						const indent = token ? '\t'.repeat(token.loc.start.column) : '\t';
						return fixer.insertTextBefore(
							firstProp as any,
							`exampleName: '${defaultName}' as keyof typeof import('${importPath}') ,\n${indent}`,
						);
					},
				});
			},
		};
	},
};

export default rule;
