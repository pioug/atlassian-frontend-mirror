import type { Rule } from 'eslint';
import { isNodeOfType, type VariableDeclarator } from 'eslint-codemod-utils';

import { styledObjectToXcssTokens } from '../css-to-xcss';

/**
 * Transforms a variable like:
 * ```
 * const MyComponent = styled.div({
 *   padding: '8px',
 * })
 * ```
 * to
 * ```
 * const myComponentStyles = xcss({
 *   padding: 'space.100',
 * })
 * ```
 */
export const convertStyledComponentToXcss = (
	styles: VariableDeclarator,
	newStylesVariableName: string,
	fixer: Rule.RuleFixer,
) => {
	const fixes = [];

	// renames the variable from MyComponent to myComponentStyles
	fixes.push(fixer.replaceText(styles.id, newStylesVariableName));

	// renames the function call from styled.<tag> to xcss
	if (styles.init && isNodeOfType(styles.init, 'CallExpression')) {
		fixes.push(fixer.replaceText(styles.init.callee, 'xcss'));
	}

	// converts CSS values to XCSS-compatible tokens
	if (styles.init && isNodeOfType(styles.init, 'CallExpression')) {
		const objectExpression = styles.init.arguments[0];
		if (isNodeOfType(objectExpression, 'ObjectExpression')) {
			fixes.push(...styledObjectToXcssTokens(objectExpression, fixer));
		}
	}

	return fixes;
};
