import { ESLintUtils } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator.withoutDocs<[], 'enforcePluginStructure'>({
	defaultOptions: [],
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce editor plugin structure for all plugins.',
			recommended: 'error',
		},
		messages: {
			enforcePluginStructure:
				'Plugin package.json must include "code-structure": ["editor-plugin"] in the techstack. See https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4106313244/EES+Proposal+003+Editor+Plugins+Standards',
		},
		schema: [],
	},
	create: function (context) {
		return {
			Program(node) {
				if (!context.getFilename().endsWith('package.json')) {
					return;
				}

				const sourceCode = context.getSourceCode().text;
				// Extract the JSON part from the module.exports wrapper
				const jsonString = sourceCode
					.replace(/^.*?module\.exports\s*=\s*/u, '')
					.replace(/;\s*$/u, '');
				const jsonContent = JSON.parse(jsonString);

				const techstack = jsonContent.techstack;
				if (
					!techstack ||
					!techstack['@atlassian/frontend'] ||
					!techstack['@atlassian/frontend']['code-structure'] ||
					!techstack['@atlassian/frontend']['code-structure'].includes('editor-plugin')
				) {
					context.report({
						node,
						messageId: 'enforcePluginStructure',
					});
				}
			},
		};
	},
});

// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
module.exports = rule;
