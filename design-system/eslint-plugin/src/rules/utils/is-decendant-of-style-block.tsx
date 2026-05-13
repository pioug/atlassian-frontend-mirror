import type { Rule } from 'eslint';
import type { Expression } from 'eslint-codemod-utils';

import { isCssInJsCallNode } from './is-css-in-js-call-node';
import { isCssInJsObjectNode } from './is-css-in-js-object-node';
import { isCssInJsTemplateNode } from './is-css-in-js-template-node';

export const isDecendantOfStyleBlock = (node: Rule.Node): boolean => {
	if (node.type === 'VariableDeclarator') {
		if (node.id.type !== 'Identifier') {
			return false;
		}

		if (
			// @ts-ignore typeAnnotation is not defined by types
			node.id.typeAnnotation &&
			// @ts-ignore typeAnnotation is not defined by types
			node.id.typeAnnotation.typeAnnotation.type === 'GenericTypeAnnotation' &&
			// @ts-ignore typeAnnotation is not defined by types
			node.id.typeAnnotation.typeAnnotation.id.type === 'Identifier'
		) {
			// @ts-ignore typeAnnotation is not defined by types
			const typeName = node.id.typeAnnotation.typeAnnotation.id.name;
			const hasCSSType = ['CSSProperties', 'CSSObject'].some((el) => typeName.includes(el));

			if (hasCSSType) {
				return true;
			}
		}

		// @ts-ignore Name is not defined in types
		const varName = node.id.name.toLowerCase();

		return ['style', 'css', 'theme'].some((el) => varName.includes(el));
	}

	if (
		isCssInJsCallNode(node as Expression) ||
		isCssInJsObjectNode(node as Expression) ||
		isCssInJsTemplateNode(node as Expression)
	) {
		return true;
	}

	if (
		node.type === 'TaggedTemplateExpression' &&
		node.tag.type === 'Identifier' &&
		node.tag.name === 'css'
	) {
		return true;
	}

	if (node.parent) {
		return isDecendantOfStyleBlock(node.parent);
	}

	return false;
};
