import type { Rule } from 'eslint';

import { getIsException } from '../utils/get-is-exception';
import { includesHardCodedColor } from '../utils/includes-hard-coded-color';
import { isLegacyColor } from '../utils/is-legacy-color';

import { getTokenSuggestion } from './get-token-suggestion';
import type { RuleConfig } from './types';

// JSXExpressionContainer > Identifier
export const lintJSXIdentifierForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	// To force the correct node type
	if (node.type !== 'Identifier') {
		return;
	}

	const isException = getIsException(config.exceptions);
	if (isException(node)) {
		return;
	}

	if (isLegacyColor(node.name) || includesHardCodedColor(node.name)) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, node.name, config),
		});
		return;
	}
};
