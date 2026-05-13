import { type CallExpression, type Expression } from 'eslint-codemod-utils';

const cssInJsCallees = ['css', 'styled', 'styled2'];

export const isCssInJsObjectNode = (node?: Expression | null): node is CallExpression =>
	node?.type === 'CallExpression' &&
	node.callee.type === 'MemberExpression' &&
	node.callee.object.type === 'Identifier' &&
	cssInJsCallees.includes(node.callee.object.name);
