import { type TSESTree } from '@typescript-eslint/typescript-estree';
import { type TSESLint } from '@typescript-eslint/utils';

export const rule: TSESLint.RuleModule<string> = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Ensure value assignment do not occur when the initialisor is of type HTMLElement and the assignment is in a different function scope. /n' +
				'This implementation could potentially lead to a memory leak due to detached elements not being able to be garbage collected. /n ' +
				'To avoid the memory leak, please wrap the assignment in WeakRef, WeakMap or WeakSet',
			recommended: 'error',
		},
		messages: {
			differentScope:
				"Assignment of an HTMLElement to '{{name}}' occurs in a different function scope. Please use ",
		},
		schema: [], // no options
	},
	create(context) {
		const declaredScopes = new Map();
		const functionStack: Set<string>[] = [new Set()];

		function isExpressionReturningHTMLElement(node: TSESTree.Expression) {
			if (!node) {
				return false;
			}
			return (
				(node.type === 'NewExpression' &&
					node.callee.type === 'Identifier' &&
					node.callee.name === 'HTMLElement') ||
				(node.type === 'CallExpression' &&
					node.callee.type === 'MemberExpression' &&
					node.callee.object.type === 'Identifier' &&
					node.callee.property.type === 'Identifier' &&
					((node.callee.object.name === 'document' &&
						[
							'createElement',
							'createElementNS',
							'getElementById',
							'querySelector',
							'querySelectorAll',
						].includes(node.callee.property.name)) ||
						['querySelector', 'querySelectorAll'].includes(node.callee.property.name)))
			);
		}

		function isFunctionReturningHTMLElement(node: TSESTree.Expression) {
			if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
				const body = node.body;
				if (body.type === 'BlockStatement') {
					return body.body.some((statement) => {
						if (statement.type === 'ReturnStatement' && statement.argument) {
							return isExpressionReturningHTMLElement(statement.argument);
						}
						return false;
					});
				}
				return isExpressionReturningHTMLElement(body);
			}
			return false;
		}

		return {
			VariableDeclarator(node: TSESTree.VariableDeclarator) {
				const currentScope = context.getScope();
				if (node.id.type === 'Identifier') {
					declaredScopes.set(node.id.name, currentScope);
					functionStack[functionStack.length - 1].add(node.id.name);
				}
			},

			FunctionDeclaration() {
				functionStack.push(new Set());
			},

			'FunctionDeclaration:exit'() {
				functionStack.pop();
			},

			AssignmentExpression(node: TSESTree.AssignmentExpression) {
				const { left, right } = node;

				if (left.type === 'Identifier') {
					const variableName = left.name;
					const isInSameFunctionScope = functionStack[functionStack.length - 1].has(variableName);

					if (!isInSameFunctionScope) {
						if (isExpressionReturningHTMLElement(right) || isFunctionReturningHTMLElement(right)) {
							context.report({
								node: left,
								messageId: 'differentScope',
								data: { name: variableName },
							});
						}
					}
				}
			},
		};
	},
	defaultOptions: [],
};

export default { rule };
