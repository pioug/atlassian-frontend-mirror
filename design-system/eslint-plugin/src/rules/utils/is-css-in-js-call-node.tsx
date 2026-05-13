import { type CallExpression, type Expression } from 'eslint-codemod-utils';

const cssInJsCallees = ['css', 'styled', 'styled2'];

export const isCssInJsCallNode = (node?: Expression | null): node is CallExpression =>
	node?.type === 'CallExpression' &&
	node.callee.type === 'Identifier' &&
	cssInJsCallees.includes(node.callee.name);
