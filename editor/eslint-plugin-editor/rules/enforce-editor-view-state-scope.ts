import { TSESTree, type TSESLint } from '@typescript-eslint/utils';

export const rule: TSESLint.RuleModule<string> = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure EditorState and EditorView are from the same scope',
			recommended: 'error',
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
				const parserServices = context.parserServices;
				if (!parserServices || !parserServices.program || !parserServices.esTreeNodeToTSNodeMap) {
					return {};
				}
				const typeChecker = parserServices.program.getTypeChecker();

				function isTsType(node: TSESTree.Node, name: string): boolean {
					if (!node || !node.type || node.type !== 'Identifier') {
						return false;
					}

					const tsNode = parserServices?.esTreeNodeToTSNodeMap.get(node);
					const type = tsNode && typeChecker.getTypeAtLocation(tsNode);
					const typeName = type && typeChecker.typeToString(type);
					return typeName === name;
				}

				const functionScope = context.getScope();

				functionScope.through.forEach((ref) => {
					// check if ref has ts type EditorState and the functionScope variables include ts type EditorView
					if (
						isTsType(ref.identifier, 'EditorState') &&
						functionScope.variables.some((v) => isTsType(v.identifiers[0], 'EditorView'))
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

export default { rule };
