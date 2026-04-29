import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import type { Node as ESTreeNode } from 'estree';

import { createLintRule } from '../utils/create-rule';

type Options = [{ allowPrimitiveExports?: boolean }?];

/**
 * Returns true if the variable declarator's initializer is a primitive literal
 * (string, number, boolean, template literal, or null/undefined).
 */
function isPrimitiveLiteral(declarator: TSESTree.VariableDeclarator): boolean {
	const init = declarator.init;
	if (init == null) {
		return false;
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

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-multiple-exports',
		docs: {
			description:
				'Allows at most one runtime export per module so each file maps to a single bundler unit; `export type` / `export interface` are exempt.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			'no-multiple-exports':
				'Volt Strict Mode allows only one runtime export per file. Split additional exports into separate modules. `export type` / `export interface` for types are exempt.',
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
		const options = (context.options as Options)[0] ?? {};
		const allowPrimitiveExports = options.allowPrimitiveExports ?? false;

		return {
			Program(node) {
				const parts: ESTreeNode[] = [];

				for (const stmt of node.body) {
					if (stmt.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
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
							decl.type === AST_NODE_TYPES.TSTypeAliasDeclaration
						) {
							continue;
						}

						if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
							for (const declarator of decl.declarations) {
								if (
									allowPrimitiveExports &&
									isPrimitiveLiteral(declarator as TSESTree.VariableDeclarator)
								) {
									continue;
								}
								parts.push(declarator as ESTreeNode);
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
						parts.push(exportSpec as ESTreeNode);
					}
				}
				if (parts.length <= 1) {
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
