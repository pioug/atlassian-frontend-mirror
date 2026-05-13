import type { Rule } from 'eslint';
import { type JSXElement } from 'eslint-codemod-utils';

import { JSXElementHelper } from '../../../ast-nodes/jsx-element-helper';
import type { RuleConfig } from '../config/types';

// Add color="inherit" prop depending on config
export function addColorInheritAttributeFix(
	node: JSXElement,
	config: RuleConfig,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	if (!config.inheritColor) {
		return;
	}

	return JSXElementHelper.addAttribute(node, 'color', 'inherit', fixer);
}
