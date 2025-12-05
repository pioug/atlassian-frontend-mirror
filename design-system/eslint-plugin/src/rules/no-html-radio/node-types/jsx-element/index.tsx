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

		const nodeName = ast.JSXElement.getName(node);

		context.report({
			node: node.openingElement,
			messageId: 'noHtmlRadio',
			data: {
				name: nodeName,
			},
		});
	},
};
