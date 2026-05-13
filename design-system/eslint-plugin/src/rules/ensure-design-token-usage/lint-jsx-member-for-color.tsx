import type { Rule } from 'eslint';
import { node as generate, isNodeOfType } from 'eslint-codemod-utils';

import { isLegacyColor } from '../utils/is-legacy-color';
import { isLegacyNamedColor } from '../utils/is-legacy-named-color';

import { getTokenSuggestion } from './get-token-suggestion';
import type { RuleConfig } from './types';

// JSXExpressionContainer > MemberExpression
export const lintJSXMemberForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	// To force the correct node type
	if (node.type !== 'MemberExpression') {
		return;
	}

	if (!isNodeOfType(node.property, 'Identifier')) {
		return;
	}

	if (
		isLegacyColor(node.property.name) ||
		(isNodeOfType(node.object, 'Identifier') &&
			node.object.name === 'colors' &&
			isLegacyNamedColor(node.property.name))
	) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, generate(node).toString(), config),
		});

		return;
	}
};
