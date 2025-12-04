/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { isPropertyName, type MetaData } from './common';

export const RestrictedProperty = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		if (RestrictedProperty._check(node, { context, config })) {
			let property = 'fontSize, lineHeight, fontWeight or letterSpacing';
			// @ts-ignore - Node type compatibility issue with EslintNode
			if (isNodeOfType(node, 'Identifier')) {
				property = node.name;
				// @ts-ignore - Node type compatibility issue with EslintNode
			} else if (isNodeOfType(node, 'Literal')) {
				property = String(node.value);
			}
			context.report({
				node,
				messageId:
					property === 'fontWeight'
						? 'noRestrictedTypographyPropertiesHeading'
						: 'noRestrictedTypographyProperties',
				data: { property },
			});
		}
	},
	_check(node: Rule.Node, { config }: MetaData): boolean {
		if (!config.patterns.includes('restricted-property')) {
			return false;
		}

		// Prevent font weight being used in combination with heading tokens
		if (isPropertyName(node, 'fontWeight')) {
			// @ts-ignore - node.parent possibly null
			if (isNodeOfType(node.parent.parent, 'ObjectExpression')) {
				for (const property of node.parent.parent.properties) {
					// Only looking for heading token on `font` property
					const isFontProperty =
						isNodeOfType(property, 'Property') &&
						((isNodeOfType(property.key, 'Literal') && property.key.value === 'font') ||
							(isNodeOfType(property.key, 'Identifier') && property.key.name === 'font'));
					if (!isFontProperty) {
						continue;
					}

					// Checking for heading token string, for example xcss({ font: 'font.heading.medium' })
					if (
						isNodeOfType(property.value, 'Literal') &&
						typeof property.value.value === 'string' &&
						property.value.value?.startsWith('font.heading')
					) {
						return true;
					}

					// Checking for wrapped heading token, for example xcss({ font: token('font.heading.medium') })
					if (
						isNodeOfType(property.value, 'CallExpression') &&
						isNodeOfType(property.value.callee, 'Identifier') &&
						property.value.callee.name === 'token' &&
						isNodeOfType(property.value.arguments[0], 'Literal') &&
						typeof property.value.arguments[0].value === 'string' &&
						property.value.arguments[0].value.startsWith('font.heading')
					) {
						return true;
					}
				}
			}
			return false;
		}

		return true;
	},
};
