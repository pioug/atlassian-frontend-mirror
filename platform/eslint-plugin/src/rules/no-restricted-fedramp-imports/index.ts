// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const RESTRICTED_IMPORTS: Record<string, string[]> = {
	'@atlassian/atl-context': ['isFedRamp', 'isIsolatedCloud'],
	'@atlaskit/atlassian-context': ['isFedRamp', 'isIsolatedCloud'],
	'@atlassian/teams-common': ['isFedramp'],
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow importing deprecated FedRamp/IsolatedCloud context functions. Use isFeatureEnabled from AEM (Atlassian Environment Manager) instead.',
			recommended: true,
		},
		messages: {
			noRestrictedFedrampImports:
				'{{name}} from {{source}} will be deprecated soon. Please use isFeatureEnabled from AEM (Atlassian Environment Manager) instead. See go/AEM for more details.',
		},
		schema: [],
	},
	create(context) {
		return {
			ImportDeclaration(node) {
				const source = node.source.value;
				if (typeof source !== 'string') {
					return;
				}

				const restrictedNames = RESTRICTED_IMPORTS[source];
				if (!restrictedNames) {
					return;
				}

				for (const specifier of node.specifiers) {
					if (
						specifier.type === 'ImportSpecifier' &&
						restrictedNames.includes(specifier.imported.name)
					) {
						context.report({
							node: specifier,
							messageId: 'noRestrictedFedrampImports',
							data: {
								name: specifier.imported.name,
								source,
							},
						});
					}
				}
			},
		};
	},
};

export default rule;
