import type { Rule } from 'eslint';

import { JSXElement as JSXElementHelper } from '../../../../ast-nodes/jsx-element';
import { isSupportedForLint } from '../supported';

interface MetaData {
	context: Rule.RuleContext;
}

export const JSXElement = {
	lint(node: Rule.Node, { context }: MetaData): void {
		if (!isSupportedForLint(node)) {
			return;
		}

		const nodeName = JSXElementHelper.getName(node);

		context.report({
			node: node.openingElement,
			messageId: 'noHtmlCheckbox',
			data: {
				name: nodeName,
			},
		});
	},
};
