import type { Rule } from 'eslint';
import { node as generate, isNodeOfType, type Property } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { getIsException } from '../utils/get-is-exception';
import { includesHardCodedColor } from '../utils/includes-hard-coded-color';
import { isHardCodedColor } from '../utils/is-hard-coded-color';
import { isLegacyColor } from '../utils/is-legacy-color';
import { isLegacyNamedColor } from '../utils/is-legacy-named-color';
import { getTokenSuggestion } from './get-token-suggestion';
import type { RuleConfig } from './types';

type TypeScriptExpressionWrapper = Rule.Node & { expression: Rule.Node };
const TYPESCRIPT_EXPRESSION_WRAPPER_TYPES = new Set([
	'TSAsExpression',
	'TSTypeAssertion',
	'TSNonNullExpression',
	'TSSatisfiesExpression',
]);

/**
 * TypeScript's expression wrappers are transparent for color classification.
 * In particular, `key as readonly string[]` is still the same computed key as
 * `key`. Unwrapping before inspecting the member property also keeps the
 * codemod stringifier away from type-only nodes it does not support.
 */
const unwrapTypeScriptExpression = (node: Rule.Node): Rule.Node => {
	let expression = node;

	while (TYPESCRIPT_EXPRESSION_WRAPPER_TYPES.has((expression as { type: string }).type)) {
		expression = (expression as TypeScriptExpressionWrapper).expression;
	}

	return expression;
};

// ObjectExpression
export const lintObjectForColor = (
	propertyNode: Property,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	let propertyKey = '';

	if (propertyNode.key.type === 'Identifier') {
		propertyKey = propertyNode.key.name.toString();
	}

	const node = propertyNode.value as Rule.Node;

	// ObjectExpression > Property > Literal
	if (node.type === 'Literal') {
		const nodeVal = node.value?.toString() || '';
		const isException = getIsException(config.exceptions);

		if ((isHardCodedColor(nodeVal) || includesHardCodedColor(nodeVal)) && !isException(node)) {
			context.report({
				messageId: 'hardCodedColor',
				node,
				suggest: getTokenSuggestion(node, `'${nodeVal}'`, config),
			});
		}
		return;
	}

	const isException = getIsException(config.exceptions);

	// ObjectExpression > Property > CallExpression
	if (node.type === 'CallExpression') {
		if (!isNodeOfType(node.callee, 'Identifier')) {
			return;
		}

		if (!isLegacyNamedColor(node.callee.name) || isException(node)) {
			return;
		}

		context.report({
			messageId: 'hardCodedColor',
			node: node,
			suggest: getTokenSuggestion(node, `${node.callee.name}()`, config),
		});
		return;
	}

	// Template literals are already handled by 'TemplateLiteral > Identifier' in the main file
	if (node.type === 'TemplateLiteral') {
		return;
	}

	let identifierNode: Rule.Node | null = null;

	// ObjectExpression > Property > MemberExpression
	if (node.type === 'MemberExpression') {
		const property = unwrapTypeScriptExpression(node.property as Rule.Node);

		if (property.type !== 'Identifier') {
			context.report({
				messageId: 'hardCodedColor',
				node: node,
				suggest: getTokenSuggestion(
					node,
					property === node.property
						? generate(node).toString()
						: getSourceCode(context).getText(node),
					config,
				),
			});

			return;
		}

		identifierNode = property;
	}

	if (node.type === 'Identifier') {
		// identifier is the key and not the value
		if (node.name === propertyKey) {
			return;
		}

		identifierNode = node;
	}

	// ObjectExpression > Property > MemberExpression > Identifier
	// ObjectExpression > Property > Identifier
	if (identifierNode?.type === 'Identifier') {
		if (
			(isHardCodedColor(identifierNode.name) ||
				includesHardCodedColor(identifierNode.name) ||
				isLegacyColor(identifierNode.name)) &&
			!isException(identifierNode)
		) {
			context.report({
				messageId: 'hardCodedColor',
				node: identifierNode,
				suggest: getTokenSuggestion(identifierNode, identifierNode.name, config),
			});

			return;
		}
	}

	return;
};
