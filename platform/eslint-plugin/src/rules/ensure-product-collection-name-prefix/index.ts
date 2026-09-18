import type { Rule } from 'eslint';

import { getAncestors } from '../util/context-compat';
import { getObjectPropertyAsLiteral } from '../util/handle-ast-object';

const requiredPrefix = '@atlassian/product-collection__';

const productCollectionPackageJson = /(?:^|\/)packages\/product-collection\/[^/]+\/package\.json$/;

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: `This rule ensures that packages inside packages/product-collection are named with the ${requiredPrefix} prefix.`,
			recommended: true,
		},
		hasSuggestions: false,
		messages: {
			nameRequired:
				'Packages in packages/product-collection must declare a `name` starting with `{{requiredPrefix}}`.',
			invalidNamePrefix:
				'Packages in packages/product-collection must be named with the `{{requiredPrefix}}` prefix, but found `{{packageName}}`.',
		},
	},
	create(context) {
		const filename: string = context.filename ?? context.getFilename();

		if (!productCollectionPackageJson.test(filename.split('\\').join('/'))) {
			return {};
		}

		return {
			ObjectExpression: (node: Rule.Node) => {
				if (node.type !== 'ObjectExpression') {
					return;
				}

				if (getAncestors(context, node).some((ancestor) => ancestor.type === 'ObjectExpression')) {
					return;
				}

				const packageName = getObjectPropertyAsLiteral(node, 'name');

				if (typeof packageName !== 'string') {
					return context.report({
						node,
						messageId: 'nameRequired',
						data: { requiredPrefix },
					});
				}

				if (!packageName.startsWith(requiredPrefix)) {
					return context.report({
						node,
						messageId: 'invalidNamePrefix',
						data: { requiredPrefix, packageName },
					});
				}
			},
		};
	},
};

export default rule;
