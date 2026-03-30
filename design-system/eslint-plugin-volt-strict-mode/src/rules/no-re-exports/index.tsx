import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';
import type { Node as ESTreeNode } from 'estree';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';
import { isImportBinding, lookupVariable } from '../utils/scope-utils';

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

export const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-re-exports',
		docs: {
			description:
				'Disallows re-exporting symbols from other modules (barrel patterns and import-then-export indirection) so consumers and bundlers do not chase extra layers.',
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
		function report(node: ESTreeNode) {
			context.report({ node, messageId: 'no-re-exports' });
		}

		function reportIfImportedIdentifier(id: TSESTree.Identifier) {
			const variable = lookupVariable(
				getScope(context, id as ESTreeNode) as TSESLint.Scope.Scope,
				id.name,
			);
			if (variable && isImportBinding(variable)) {
				report(id as ESTreeNode);
			}
		}

		return {
			ExportAllDeclaration(node) {
				report(node);
			},

			ExportNamedDeclaration(node) {
				const named = node as TSESTree.ExportNamedDeclaration;

				if (named.source != null) {
					report(node);
					return;
				}

				if (named.exportKind === 'type') {
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
				const arg = exportDefault.declaration;
				if (arg.type === AST_NODE_TYPES.Identifier) {
					reportIfImportedIdentifier(arg);
				}
			},
		};
	},
});

export default rule;
