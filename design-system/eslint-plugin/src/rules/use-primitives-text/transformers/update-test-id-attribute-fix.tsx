import type { Rule } from 'eslint';
import { type JSXElement } from 'eslint-codemod-utils';

import { JSXAttribute } from '../../../ast-nodes/jsx-attribute';
import { JSXElementHelper } from '../../../ast-nodes/jsx-element-helper';

// Rename data-testid prop to testId if present
export function updateTestIdAttributeFix(
	node: JSXElement,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	const testIdAttr = JSXElementHelper.getAttributeByName(node, 'data-testid');
	if (testIdAttr) {
		return JSXAttribute.updateName(testIdAttr, 'testId', fixer);
	}
}
