import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import { FunctionCall } from '../../../ast-nodes/function-call';
import { JSXElement as JSXElementHelper } from '../../../ast-nodes/jsx-element';

// The use of `<FormattedMessage ... />` component and `{formatMessage(...)}` are allowed as these are used for i18n
export function hasTextChildrenOnly(node: JSXElement): boolean {
	return node.children?.every((child) => {
		if (isNodeOfType(child, 'JSXText')) {
			return true;
		}

		// JSX child element <span><FormattedMessage /></span>
		if (
			isNodeOfType(child, 'JSXElement') &&
			JSXElementHelper.getName(child) === 'FormattedMessage'
		) {
			return true;
		}

		// JSX expression <span>{formatMessage(...)}</span>
		if (
			isNodeOfType(child, 'JSXExpressionContainer') &&
			isNodeOfType(child.expression, 'CallExpression')
		) {
			return FunctionCall.getName(child.expression) === 'formatMessage';
		}

		return false;
	});
}
