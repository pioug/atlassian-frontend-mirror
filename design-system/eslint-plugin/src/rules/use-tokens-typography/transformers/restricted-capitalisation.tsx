/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type Property } from 'eslint-codemod-utils';

import { type RuleConfig } from '../config';

interface MetaData {
	context: Rule.RuleContext;
	config: RuleConfig;
}

export const RestrictedCapitalisation = {
	lint(node: Rule.Node, { context, config }: MetaData): void {
		if (RestrictedCapitalisation._check(node, { context, config })) {
			context.report({
				node,
				messageId: 'noRestrictedCapitalisation',
			});
		}
	},
	_check(node: Rule.Node, { config }: MetaData): node is Property & Rule.NodeParentExtension {
		if (!config.patterns.includes('restricted-capitalisation')) {
			return false;
		}

		if (!isNodeOfType(node, 'Property')) {
			return false;
		}

		// Prevent text transform being used to uppercase all characters
		if (
			isNodeOfType(node.key, 'Identifier') &&
			node.key.name === 'textTransform' &&
			isNodeOfType(node.value, 'Literal')
		) {
			return node.value.value === 'uppercase';
		}

		return false;
	},
};
