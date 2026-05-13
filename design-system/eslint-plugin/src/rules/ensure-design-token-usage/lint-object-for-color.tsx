import type { Rule } from 'eslint';
import { node as generate, isNodeOfType, type Property } from 'eslint-codemod-utils';

import { getIsException } from '../utils/get-is-exception';
import { includesHardCodedColor } from '../utils/includes-hard-coded-color';
import { isHardCodedColor } from '../utils/is-hard-coded-color';
import { isLegacyColor } from '../utils/is-legacy-color';
import { isLegacyNamedColor } from '../utils/is-legacy-named-color';

import { getTokenSuggestion } from './get-token-suggestion';
import type { RuleConfig } from './types';

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
		if (node.property.type !== 'Identifier') {
			context.report({
				messageId: 'hardCodedColor',
				node: node,
				suggest: getTokenSuggestion(node, generate(node).toString(), config),
			});

			return;
		}

		identifierNode = node.property as Rule.Node;
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
