import type { Rule } from 'eslint';
import { isIdentifierImportedFrom, type Node } from '../utils';

const BANNED_IMPORTS_SET = new Set(['@atlaskit/feature-gate-js-client']);

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			url: 'https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/platform/eslint-plugin/src/rules/use-recommended-utils/README.md',
			description: 'Prefer using the feature flag abstraction over direct statsig library.',
		},
		messages: {
			notSupported:
				'Experimentation is not suported in platform feature flags, reach out to #help-statsig-switcheroo.',
			useRecommended:
				'Please do not use FeatureGates.{{util}}, use {{recommended}} from {{lib}} instead.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			'CallExpression > MemberExpression:matches([property.name="checkGate"])': (
				node: Node<'MemberExpression'>,
			) => {
				if (
					node.object.type === 'Identifier' &&
					isIdentifierImportedFrom(node.object.name, BANNED_IMPORTS_SET, context)
				) {
					context.report({
						messageId: 'useRecommended',
						node,
						data: {
							lib: '`@atlaskit/platform-feature-flags`',
							util: (node.property as any).name,
							recommended: '`fg`',
						},
					});
				}
			},
			'CallExpression > MemberExpression:matches([property.name="getExperimentValue"])': (
				node: Node<'MemberExpression'>,
			) => {
				if (
					node.object.type === 'Identifier' &&
					isIdentifierImportedFrom(node.object.name, BANNED_IMPORTS_SET, context)
				) {
					context.report({
						messageId: 'notSupported',
						node,
					});
				}
			},
		};
	},
};

export default rule;
