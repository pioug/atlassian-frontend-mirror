import type { Rule } from 'eslint';

import * as ast from '../../../../ast-nodes';
import { isSupportedForLint } from '../supported';

interface MetaData {
	context: Rule.RuleContext;
}

export const JSXElement = {
	lint(node: Rule.Node, { context }: MetaData) {
		if (!isSupportedForLint(node)) {
			return;
		}

		context.report({
			node: node.openingElement,
			messageId: 'noHtmlButton',
			data: {
				name: ast.JSXElement.getName(node),
			},
		});
	},
};
