/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

export const BannedProperty = {
	lint(node: Rule.Node, { context }: { context: Rule.RuleContext }) {
		if (BannedProperty._check(node)) {
			let property = 'fontSize, lineHeight, fontWeight or letterSpacing';
			if (isNodeOfType(node, 'Identifier')) {
				property = node.name;
			} else if (isNodeOfType(node, 'Literal')) {
				property = String(node.value);
			}
			context.report({
				node,
				messageId: 'noUnsafeTypographyProperties',
				data: { property },
			});
		}
	},
	_check(node: Rule.Node): boolean {
		// Prevent font weight being used in combination with heading tokens
		if (
			(isNodeOfType(node, 'Identifier') && node.name === 'fontWeight') ||
			(isNodeOfType(node, 'Literal') && node.value === 'fontWeight')
		) {
			if (isNodeOfType(node.parent.parent, 'ObjectExpression')) {
				for (const property of node.parent.parent.properties) {
					if (
						isNodeOfType(property, 'Property') &&
						isNodeOfType(property.value, 'CallExpression') &&
						isNodeOfType(property.value.callee, 'Identifier') &&
						isNodeOfType(property.value.arguments[0], 'Literal')
					) {
						if (
							property.value.callee.name === 'token' &&
							typeof property.value.arguments[0].value === 'string' &&
							property.value.arguments[0].value.includes('font.heading')
						) {
							return true;
						}
					}
				}
			}
			return false;
		}

		return true;
	},
};
