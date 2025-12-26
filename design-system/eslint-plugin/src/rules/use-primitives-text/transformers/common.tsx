import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';
import { type RuleConfig } from '../config';

export type MetaData = {
	context: Rule.RuleContext;
	config: RuleConfig;
};

// Rename data-testid prop to testId if present
export function updateTestIdAttributeFix(node: JSXElement, fixer: Rule.RuleFixer) {
	const testIdAttr = ast.JSXElement.getAttributeByName(node, 'data-testid');
	if (testIdAttr) {
		return ast.JSXAttribute.updateName(testIdAttr, 'testId', fixer);
	}
}

// Add color="inherit" prop depending on config
export function addColorInheritAttributeFix(
	node: JSXElement,
	config: RuleConfig,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	if (!config.inheritColor) {
		return;
	}

	return ast.JSXElement.addAttribute(node, 'color', 'inherit', fixer);
}

export const allowedAttrs: string[] = ['id', 'data-testid', 'key'];

// Only allow elements with strings as children
// The use of `<FormattedMessage ... />` component and `{formatMessage(...)}` are allowed as these are used for i18n
export function hasTextChildrenOnly(node: JSXElement) {
	return node.children?.every((child) => {
		if (isNodeOfType(child, 'JSXText')) {
			return true;
		}

		// JSX child element <span><FormattedMessage /></span>
		if (isNodeOfType(child, 'JSXElement') && ast.JSXElement.getName(child) === 'FormattedMessage') {
			return true;
		}

		// JSX expression <span>{formatMessage(...)}</span>
		if (
			isNodeOfType(child, 'JSXExpressionContainer') &&
			isNodeOfType(child.expression, 'CallExpression')
		) {
			return ast.FunctionCall.getName(child.expression) === 'formatMessage';
		}

		return false;
	});
}
