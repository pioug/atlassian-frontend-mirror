import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import { JSXElementHelper } from '../../../../ast-nodes/jsx-element-helper';

/**
 * Transforms a JSXElement from:
 * ```
 *   <div>
 *     // ...
 *   </div>
 * ```
 * to
 * ```
 *   <Box xcss={myStyles}>
 *     // ...
 *   </Box>
 * ```
 */
export const convertJsxCallSite = (
	jsxElement: JSXElement,
	newStylesVariableName: string,
	fixer: Rule.RuleFixer,
): Rule.Fix[] => {
	const fixes = [];

	// renames the JSX call site
	if (isNodeOfType(jsxElement, 'JSXElement')) {
		fixes.push(...JSXElementHelper.updateName(jsxElement, 'Box', fixer));
	}

	// adds xcss prop
	fixes.push(
		fixer.insertTextAfter(jsxElement.openingElement.name, ` xcss={${newStylesVariableName}}`),
	);

	return fixes;
};
