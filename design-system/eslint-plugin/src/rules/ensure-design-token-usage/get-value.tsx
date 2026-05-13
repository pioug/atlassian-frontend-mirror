import type { Rule } from 'eslint';
import { type CallExpression, type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

import { findIdentifierInParentScope } from '../utils/find-in-parent';

import { getValueFromShorthand } from './get-value-from-shorthand';
import { getValueFromTemplateLiteralRaw } from './get-value-from-template-literal-raw';
import { isBorderRadius } from './is-border-radius';
import { removePixelSuffix } from './remove-pixel-suffix';

const isGridSize = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	(node.callee.name === 'gridSize' || node.callee.name === 'getGridSize') &&
	// If there are arguments we know it's a custom gridSize function and cannot be certain what it returns
	node.arguments.length === 0;

const isToken = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	node.callee.name === 'token';

const getRawExpressionForToken = (node: CallExpression, context: Rule.RuleContext): string => {
	const args = node.arguments;
	const call = `\${token(${args
		.map((argNode) => {
			if (isNodeOfType(argNode, 'Literal')) {
				return argNode.raw;
			}

			if (isNodeOfType(argNode, 'Identifier')) {
				return argNode.name;
			}

			if (isNodeOfType(argNode, 'MemberExpression')) {
				return getValue(argNode, context);
			}
		})
		.join(', ')})}`;
	return call;
};

const isFontSize = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	(node.callee.name === 'fontSize' || node.callee.name === 'getFontSize');

const isFontSizeSmall = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	node.callee.name === 'fontSizeSmall';

const getValueFromCallExpression = (node: EslintNode, context: Rule.RuleContext) => {
	if (!isNodeOfType(node, 'CallExpression')) {
		return null;
	}

	if (isGridSize(node)) {
		return 8;
	}

	if (isBorderRadius(node)) {
		return 3;
	}

	if (isFontSize(node)) {
		return 14;
	}

	if (isFontSizeSmall(node)) {
		return 11;
	}

	if (isToken(node)) {
		return getRawExpressionForToken(node, context);
	}

	return null;
};

const getValueFromUnaryExpression = (
	node: EslintNode,
	context: Rule.RuleContext,
): number | null => {
	if (!isNodeOfType(node, 'UnaryExpression')) {
		return null;
	}

	const value = getValue(node.argument, context);

	if (!value) {
		return null;
	}

	// eslint-disable-next-line no-eval
	return eval(`${node.operator}(${value})`);
};

const getValueFromBinaryExpression = (
	node: EslintNode,
	context: Rule.RuleContext,
): number | null => {
	if (!isNodeOfType(node, 'BinaryExpression')) {
		return null;
	}

	const { left, right, operator } = node;

	const leftValue = getValue(left, context);
	const rightValue = getValue(right, context);
	const final =
		rightValue && leftValue
			? // eslint-disable-next-line no-eval
				eval(`${leftValue}${operator}${rightValue}`)
			: null;

	return final;
};

const getValueFromIdentifier = (
	node: EslintNode,
	context: Rule.RuleContext,
): number | null | any[] | string | undefined => {
	if (!isNodeOfType(node, 'Identifier')) {
		return null;
	}

	if (node.name === 'gridSize') {
		return 8;
	}

	const scope = getScope(context, node);
	const variable = findIdentifierInParentScope({
		scope,
		identifierName: node.name,
	});

	if (!variable) {
		return null;
	}

	const definition = variable.defs[0];

	if (
		isNodeOfType(definition.node, 'ImportSpecifier') &&
		isNodeOfType(definition.node.parent!, 'ImportDeclaration') &&
		definition.node.parent.source.value === '@atlassian/jira-common-styles/src/main.tsx'
	) {
		return definition.node.imported.type === 'Identifier' &&
			definition.node.imported.name === 'gridSize'
			? 8
			: null;
	}

	if (!isNodeOfType(definition.node, 'VariableDeclarator')) {
		return null;
	}

	if (!definition.node.init) {
		return null;
	}

	return getValue(definition.node.init, context);
};

const getValueFromTemplateLiteral = (
	node: EslintNode,
	context: Rule.RuleContext,
): number[] | string[] | string | null => {
	const value = getValueFromTemplateLiteralRaw(node, context);

	return Array.isArray(value) ? (value.map(removePixelSuffix) as any[]) : value;
};

export const getValue = (
	node: EslintNode,
	context: Rule.RuleContext,
): string | number | (string | number)[] | null | undefined => {
	if (isNodeOfType(node, 'Literal')) {
		return getValueFromShorthand(node.value);
	}

	if (isNodeOfType(node, 'BinaryExpression')) {
		return getValueFromBinaryExpression(node, context);
	}

	if (isNodeOfType(node, 'UnaryExpression')) {
		return getValueFromUnaryExpression(node, context);
	}

	if (isNodeOfType(node, 'CallExpression')) {
		return getValueFromCallExpression(node, context);
	}

	if (isNodeOfType(node, 'Identifier')) {
		return getValueFromIdentifier(node, context);
	}

	if (isNodeOfType(node, 'TemplateLiteral')) {
		return getValueFromTemplateLiteral(node, context);
	}

	return null;
};
