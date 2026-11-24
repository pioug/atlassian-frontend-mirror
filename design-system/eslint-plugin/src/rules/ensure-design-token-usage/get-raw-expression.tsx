import type { Rule } from 'eslint';
import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

export const getRawExpression = (node: EslintNode, context: Rule.RuleContext): string | null => {
	if (
		!(
			// if not one of our recognized types or doesn't have a range prop, early return
			isNodeOfType(node, 'Literal') ||
			isNodeOfType(node, 'Identifier') ||
			isNodeOfType(node, 'BinaryExpression') ||
			isNodeOfType(node, 'UnaryExpression') ||
			isNodeOfType(node, 'TemplateLiteral') ||
			isNodeOfType(node, 'CallExpression')
		) ||
		!Array.isArray(node.range)
	) {
		return null;
	}
	const [start, end] = node.range;

	return getSourceCode(context).getText().substring(start, end).replaceAll('\n', '');
};
