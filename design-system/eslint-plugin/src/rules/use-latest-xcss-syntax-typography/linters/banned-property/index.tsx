/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';

const messageId = 'noUnsafeTypographyProperties';

export const BannedProperty = {
	lint(node: Rule.Node, { context }: { context: Rule.RuleContext }) {
		context.report({
			node,
			messageId,
		});
	},
};
