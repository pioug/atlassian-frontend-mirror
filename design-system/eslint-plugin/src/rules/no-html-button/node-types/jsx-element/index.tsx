import type { Rule } from 'eslint';

import * as ast from '../../../../ast-nodes';
import { isSupportedForLint } from '../supported';

interface MetaData {
	context: Rule.RuleContext;
}

export const JSXElement = {
	// @ts-ignore - Node type compatibility issue with EslintNode
	lint(node: Rule.Node, { context }: MetaData) {
		if (!isSupportedForLint(node)) {
			return;
		}

		context.report({
			node: node.openingElement,
			messageId: 'noHtmlButton',
			data: {
				// @ts-ignore - Node type compatibility issue with EslintNode
				name: ast.JSXElement.getName(node),
			},
		});
	},
};
