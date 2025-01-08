/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, Property } from 'eslint-codemod-utils';

import { getValueForPropertyNode } from '../../ensure-design-token-usage/utils';
import { isDecendantOfStyleBlock, isDecendantOfType } from '../../utils/is-node';
import { type RuleConfig } from '../config';

interface MetaData {
	context: Rule.RuleContext;
	config: RuleConfig;
}

export const UntokenizedProperties = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		// Check whether all criteria needed to make a transformation are met
		const success = UntokenizedProperties._check(node, { context, config });
		if (success) {
			return context.report({
				node,
				messageId: 'noUntokenizedProperties',
				data: {
					property: isNodeOfType(node.key, 'Identifier') ? node.key.name : 'this property',
				},
			});
		}
	},

	_check(
		node: Rule.Node,
		{ config, context }: MetaData,
	): node is Property & Rule.NodeParentExtension {
		if (!config.patterns.includes('untokenized-properties')) {
			return false;
		}

		if (!isNodeOfType(node, 'Property')) {
			return false;
		}

		if (!isDecendantOfStyleBlock(node) && !isDecendantOfType(node, 'JSXExpressionContainer')) {
			return false;
		}

		const propertyValue = getValueForPropertyNode(node, context);
		if (typeof propertyValue === 'string' && propertyValue.includes('font.')) {
			return false;
		}

		return true;
	},
};
