import type { TSESTree, TSESLint } from '@typescript-eslint/utils';

export const rule: TSESLint.RuleModule<string> = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure EditorState and EditorView are from the same scope',
		},
		schema: [],
		messages: {
			differentEditorViewAndStateScope:
				'If view is passed as a function scope parameter, state must be accessed from the same scope.',
		},
	},
	create(context) {
		return {
			FunctionDeclaration(node) {
				function hasTypeAnnotation(node: TSESTree.Node | undefined, name: string): boolean {
					if (node?.type !== 'Identifier') {
						return false;
					}

					const typeAnnotation = node.typeAnnotation?.typeAnnotation;
					return (
						typeAnnotation?.type === 'TSTypeReference' &&
						typeAnnotation.typeName.type === 'Identifier' &&
						typeAnnotation.typeName.name === name
					);
				}

				const functionScope = context.getSourceCode().scopeManager?.acquire(node);
				if (!functionScope) {
					return;
				}
				const currentFunctionScope = functionScope;

				function isVariableOfType(name: string, typeName: string): boolean {
					let scope = currentFunctionScope.upper;
					while (scope) {
						const variable = scope.set.get(name);
						if (variable) {
							return hasTypeAnnotation(variable.identifiers[0], typeName);
						}
						scope = scope.upper;
					}

					return false;
				}

				functionScope.through.forEach((ref) => {
					// Check whether an EditorState binding is used from a scope with an EditorView parameter.
					if (
						isVariableOfType(ref.identifier.name, 'EditorState') &&
						functionScope.variables.some((variable) =>
							hasTypeAnnotation(variable.identifiers[0], 'EditorView'),
						)
					) {
						context.report({
							node,
							messageId: 'differentEditorViewAndStateScope',
						});
					}
				});
			},
		};
	},
	defaultOptions: [],
};

const EnforceEditorViewStateScopeRule: {
	rule: TSESLint.RuleModule<string>;
} = { rule };
export default EnforceEditorViewStateScopeRule;
