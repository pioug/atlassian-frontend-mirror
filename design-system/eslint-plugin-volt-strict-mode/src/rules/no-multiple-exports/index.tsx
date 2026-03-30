import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import type { Node as ESTreeNode } from 'estree';

import { createLintRule } from '../utils/create-rule';

export const rule: import('eslint').Rule.RuleModule = createLintRule({
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
		type: 'problem',
	},
	create(context) {
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
