/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { isPropertyName, type MetaData } from './common';

export const RestrictedCapitalisation = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		if (RestrictedCapitalisation._check(node, { context, config })) {
			context.report({
				node,
				messageId: 'noRestrictedCapitalisation',
			});
		}
	},
	_check(node: Rule.Node, { config }: MetaData): boolean {
		if (!config.patterns.includes('restricted-capitalisation')) {
			return false;
		}

		// Prevent text transform being used to uppercase all characters
		if (
			isPropertyName(node, 'textTransform') &&
			// @ts-ignore - Node type compatibility issue with EslintNode
			isNodeOfType(node.parent, 'Property') &&
			isNodeOfType(node.parent.value, 'Literal')
		) {
			return node.parent.value.value === 'uppercase';
		}

		return true;
	},
};
