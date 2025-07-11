import { ESLintUtils } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator.withoutDocs<[], 'enforceCommonPeerDependency'>({
	defaultOptions: [],
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce editor common as a peerDependency.',
			recommended: 'error',
		},
		messages: {
			enforceCommonPeerDependency:
				'Editor common must be added as a peer dependency (see: https://hello.atlassian.net/wiki/spaces/EDITOR/pages/5453669197/Editor+RFC+073+Let+s+make+editor-common+a+peerDependency)',
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

				try {
					const packageJson = JSON.parse(jsonString);

					// Check if @atlaskit/editor-common is in dependencies
					if (packageJson.dependencies && packageJson.dependencies['@atlaskit/editor-common']) {
						context.report({
							node,
							messageId: 'enforceCommonPeerDependency',
						});
					}
				} catch (e) {
					// Not valid JSON, ignore
				}
			},
		};
	},
});

// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
module.exports = rule;
