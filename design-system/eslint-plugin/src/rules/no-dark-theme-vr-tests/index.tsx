import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

const rule = createLintRule({
	meta: {
		name: 'no-dark-theme-vr-tests',
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Disallow using dark colorScheme in VR tests.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noDarkThemeVR: `Redundant dark theme VR tests are not allowed. Check out this [RFC](https://hello.atlassian.net/wiki/spaces/DST/pages/4083370233/DSTRFC-022+-+Intent+to+remove+dark+VR+tests+from+AFM)`,
		},
	},

	create(context: Rule.RuleContext) {
		let importSources: string[] = [];

		return {
			ImportDeclaration(node) {
				if (node.source.type === 'Literal' && typeof node.source.value === 'string') {
					importSources.push(node.source.value);
				}
			},

			ObjectExpression(node) {
				if (
					importSources.every((source: string) =>
						['@af/visual-regression', '@atlassian/jira-vr-testing', '@atlassian/gemini'].includes(
							source,
						),
					)
				) {
					return {};
				}
				node.properties.forEach((prop) => {
					const environmentProperty =
						prop.type === 'Property' &&
						prop.key.type === 'Identifier' &&
						prop.key.name === 'environment'
							? prop
							: null;

					if (environmentProperty && environmentProperty.value.type === 'ObjectExpression') {
						const colorSchemeProperty = environmentProperty.value.properties.find(
							(path) =>
								path.type === 'Property' &&
								path.key.type === 'Identifier' &&
								path.key.name === 'colorScheme',
						);

						if (
							colorSchemeProperty &&
							colorSchemeProperty.type === 'Property' &&
							colorSchemeProperty.value.type === 'Literal' &&
							colorSchemeProperty.value.value === 'dark'
						) {
							context.report({
								node: node,
								messageId: 'noDarkThemeVR',
								fix: (fixer) => {
									if (node.range) {
										const [start, end] = node.range;
										return fixer.removeRange([start, end + 1]);
									}
									return null;
								},
							});
						}
					}
				});
			},
		};
	},
});

export default rule;
