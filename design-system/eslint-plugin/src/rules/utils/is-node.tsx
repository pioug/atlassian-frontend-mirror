// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule, Scope } from 'eslint';
import {
	type CallExpression,
	type EslintNode,
	type Expression,
	isNodeOfType,
	type Property,
	type TaggedTemplateExpression,
} from 'eslint-codemod-utils';

import { isXcss } from '@atlaskit/eslint-utils/is-supported-import';

import { Root } from '../../ast-nodes';

export const isDecendantOfGlobalToken = (node: EslintNode): boolean => {
	if (
		isNodeOfType(node, 'CallExpression') &&
		isNodeOfType(node.callee, 'Identifier') &&
		(node.callee.name === 'token' || node.callee.name === 'getTokenValue')
	) {
		return true;
	}

	if (node.parent) {
		return isDecendantOfGlobalToken(node.parent);
	}

	return false;
};

export const isDecendantOfType = (
	node: Rule.Node,
	type: Rule.Node['type'],
	skipNode = true,
): boolean => {
	if (!skipNode && node.type === type) {
		return true;
	}

	if (node.parent) {
		return isDecendantOfType(node.parent, type, false);
	}

	return false;
};

export const isPropertyKey = (node: Rule.Node): boolean => {
	if (isNodeOfType(node, 'Identifier') && isDecendantOfType(node, 'Property')) {
		const parent = node.parent as Property;
		return node === parent.key || parent.shorthand;
	}
	return false;
};

export const isDecendantOfStyleJsxAttribute = (node: Rule.Node): boolean => {
	if (isNodeOfType(node, 'JSXAttribute')) {
		return true;
	}

	if (node.parent) {
		return isDecendantOfStyleJsxAttribute(node.parent);
	}

	return false;
};

export const isDecendantOfSvgElement = (node: Rule.Node): boolean => {
	if (isNodeOfType(node, 'JSXElement')) {
		// @ts-ignore
		if (node.openingElement.name.name === 'svg') {
			return true;
		}
	}

	if (node.parent) {
		return isDecendantOfSvgElement(node.parent);
	}

	return false;
};

export const isDecendantOfPrimitive = (node: Rule.Node, context: Rule.RuleContext): boolean => {
	const primitivesToCheck = ['Box', 'Text'];

	if (isNodeOfType(node, 'JSXElement')) {
		// @ts-ignore
		if (primitivesToCheck.includes(node.openingElement.name.name)) {
			const importDeclaration = Root.findImportsByModule(
				context.getSourceCode().ast.body,
				'@atlaskit/primitives',
			);
			if (importDeclaration.length) {
				return true;
			}
		}
	}

	if (node.parent) {
		return isDecendantOfPrimitive(node.parent, context);
	}

	return false;
};

const cssInJsCallees = ['css', 'styled', 'styled2'];

export const isCssInJsTemplateNode = (node?: Expression | null): node is TaggedTemplateExpression =>
	node?.type === 'TaggedTemplateExpression' &&
	node.tag.type === 'MemberExpression' &&
	node.tag.object.type === 'Identifier' &&
	node.tag.object.name === 'styled';

export const isCssInJsCallNode = (node?: Expression | null): node is CallExpression =>
	node?.type === 'CallExpression' &&
	node.callee.type === 'Identifier' &&
	cssInJsCallees.includes(node.callee.name);

export const isCssInJsObjectNode = (node?: Expression | null): node is CallExpression =>
	node?.type === 'CallExpression' &&
	node.callee.type === 'MemberExpression' &&
	node.callee.object.type === 'Identifier' &&
	cssInJsCallees.includes(node.callee.object.name);

export const isDecendantOfXcssBlock = (
	node: Rule.Node,
	referencesInScope: Scope.Reference[],
	importSources: string[],
): boolean => {
	// xcss contains types for all properties that accept tokens, so ignore xcss for linting as it will report false positives
	if (node.type === 'CallExpression' && isXcss(node.callee, referencesInScope, importSources)) {
		return true;
	}

	if (node.parent) {
		return isDecendantOfXcssBlock(node.parent, referencesInScope, importSources);
	}

	return false;
};

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

export const isChildOfType = (node: Rule.Node, type: Rule.Node['type']) =>
	isNodeOfType(node.parent, type);
