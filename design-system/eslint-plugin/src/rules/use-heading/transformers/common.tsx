import type { Rule } from 'eslint';
import { type JSXElement } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';
import { type RuleConfig } from '../config';

export type MetaData = {
	context: Rule.RuleContext;
	config: RuleConfig;
};

// Rename data-testid prop to testId if present
// @ts-ignore - The inferred type cannot be named without a reference to external types
export function updateTestIdAttributeFix(node: JSXElement, fixer: Rule.RuleFixer) {
	const testIdAttr = ast.JSXElement.getAttributeByName(node, 'data-testid');
	if (testIdAttr) {
		return ast.JSXAttribute.updateName(testIdAttr, 'testId', fixer);
	}
}

export const allowedAttrs = ['id', 'data-testid', 'key'];
