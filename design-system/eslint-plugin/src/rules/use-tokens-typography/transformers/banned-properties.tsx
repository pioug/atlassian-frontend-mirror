/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type Property } from 'eslint-codemod-utils';

import { isDecendantOfStyleBlock, isDecendantOfType } from '../../utils/is-node';
import { type RuleConfig } from '../config';

interface MetaData {
	context: Rule.RuleContext;
	config: RuleConfig;
}

export const BannedProperties = {
	lint(node: Rule.Node, { context, config }: MetaData): void {
		// Check whether all criteria needed to make a transformation are met
		const success = BannedProperties._check(node, { context, config });
		if (success) {
			return context.report({
				node,
				messageId: 'noBannedProperties',
				data: {
					property: isNodeOfType(node.key, 'Identifier') ? node.key.name : 'this property',
				},
			});
		}
	},

	_check(node: Rule.Node, { config }: MetaData): node is Property & Rule.NodeParentExtension {
		if (!config.patterns.includes('banned-properties')) {
			return false;
		}

		if (!isNodeOfType(node, 'Property')) {
			return false;
		}

		if (!isDecendantOfStyleBlock(node) && !isDecendantOfType(node, 'JSXExpressionContainer')) {
			return false;
		}

		return true;
	},
};
