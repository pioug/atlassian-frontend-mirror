import type { Rule } from 'eslint';
import {
	isNodeOfType,
	literal,
	type ObjectExpression,
	type Property,
	type SpreadElement,
} from 'eslint-codemod-utils';

import { supportedStylesMap } from './supported-styles-map';

// e.g. `padding: '8px'`. For clarity, it's renamed to `entry` inside the `.map()`.
export const styledObjectToXcssTokens = (
	styles: ObjectExpression & Partial<Rule.NodeParentExtension>,
	fixer: Rule.RuleFixer,
): (Rule.Fix | undefined)[] => {
	return styles.properties.map((entry: Property | SpreadElement) => {
		if (!isNodeOfType(entry, 'Property')) {
			return;
		}

		if (!isNodeOfType(entry.key, 'Identifier')) {
			return;
		}

		// maps literal values like: 8px to 'space.100'
		if (isNodeOfType(entry.value, 'Literal')) {
			const value = entry.value.value;
			if (typeof value !== 'string') {
				return;
			}

			return fixer.replaceText(
				entry.value,
				literal(`'${supportedStylesMap[entry.key.name][value]}'`).toString(),
			);
		}
		// maps token calls like: token('space.100') to 'space.100'
		if (isNodeOfType(entry.value, 'CallExpression')) {
			const callExpression = entry.value;
			// skip if not a call to `token`
			if (
				!isNodeOfType(callExpression.callee, 'Identifier') ||
				callExpression.callee.name !== 'token' ||
				!isNodeOfType(callExpression.arguments[0], 'Literal')
			) {
				return;
			}
			// the first argument of `token` is the token name and
			// can be given directly to `xcss` as it has been validated already.
			return fixer.replaceText(
				entry.value,
				literal(`'${callExpression.arguments[0].value}'`).toString(),
			);
		}
	});
};
