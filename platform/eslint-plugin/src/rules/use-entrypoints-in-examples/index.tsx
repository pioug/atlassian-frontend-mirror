import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/use-entrypoints-in-examples/README.md',
			description: 'Encourage usage of package entrypoints in examples.',
		},
		messages: {
			useEntrypointsInExamples:
				'Use the package entrypoints instead of importing from src. This ensures examples reflect public API.\n\nFor example, use `@atlaskit/button/new` instead of `../../src/new`',
		},
		type: 'problem',
	},
	create(context) {
		/**
		 * Even if it's enabled on non-example files it will ignore them.
		 *
		 * This is a defensive check, the rule should be configured to only run on examples.
		 */
		if (!context.filename.includes('/examples/')) {
			return {};
		}

		return {
			ImportDeclaration(node) {
				const moduleName = node.source.value;
				if (typeof moduleName !== 'string') {
					return;
				}

				if (/^(\.\.\/)+src(\/|$)/.test(moduleName)) {
					context.report({
						node: node.source,
						messageId: 'useEntrypointsInExamples',
					});
				}
			},
		};
	},
};

export default rule;
