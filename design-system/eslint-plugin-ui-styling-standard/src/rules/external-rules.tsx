import type { LintRuleMeta } from '@atlaskit/eslint-utils/create-rule';

import { getRuleUrl } from './utils/create-rule';

/**
 * External rules must be scoped, have a display name, and external urls.
 */
export type ExternalRuleMeta = LintRuleMeta & {
	isExternal: true;
	name: `@${string}/${string}`;
	displayName: string;
	docs: { externalUrl: `https://${string}` };
};

const importSources: readonly string[] = [
	'@compiled/react',
	'@atlaskit/css',
	'@emotion/core',
	'@emotion/react',
	'@emotion/styled',
	'styled-components',
];

export const externalRules: ExternalRuleMeta[] = [
	{
		name: '@atlaskit/design-system/consistent-css-prop-usage',
		displayName: 'consistent-css-prop-usage',
		isExternal: true,
		fixable: 'code',
		docs: {
			description: 'Ensures consistency with `css` and `xcss` prop usages',
			url: getRuleUrl('consistent-css-prop-usage'),
			externalUrl:
				'https://atlassian.design/components/eslint-plugin-design-system/consistent-css-prop-usage/usage',
			recommended: true,
			severity: 'error',
			pluginConfig: {
				// When passing a css prop to a React component, we don't know whether the component
				// is Emotion or Compiled. Hence it is not safe to run autofixes like wrapping it in
				// a `css` function call.
				excludeReactComponents: true,
				// Ensures that `xcss` prop is still linted even when `excludeReactComponents` is `true`.
				shouldAlwaysCheckXcss: true,
			},
		},
	},
	{
		name: '@atlaskit/design-system/no-css-tagged-template-expression',
		displayName: 'no-css-tagged-template-expression',
		isExternal: true,
		fixable: 'code',
		docs: {
			description:
				'Disallows any `css` tagged template expressions that originate from Emotion, Styled Components or Compiled',
			url: getRuleUrl('no-css-tagged-template-expression'),
			externalUrl:
				'https://atlassian.design/components/eslint-plugin-design-system/no-css-tagged-template-expression/usage',
			recommended: true,
			severity: 'error',
		},
	},
	{
		name: '@atlaskit/design-system/no-keyframes-tagged-template-expression',
		displayName: 'no-keyframes-tagged-template-expression',
		isExternal: true,
		fixable: 'code',
		docs: {
			description:
				'Disallows any `keyframe` tagged template expressions that originate from Emotion, Styled Components or Compiled',
			url: getRuleUrl('no-keyframes-tagged-template-expression'),
			externalUrl:
				'https://atlassian.design/components/eslint-plugin-design-system/no-keyframes-tagged-template-expression/usage',
			recommended: true,
			severity: 'error',
		},
	},
	{
		name: '@atlaskit/design-system/no-styled-tagged-template-expression',
		displayName: 'no-styled-tagged-template-expression',
		isExternal: true,
		fixable: 'code',
		docs: {
			description:
				'Disallows any `styled` tagged template expressions that originate from Emotion, Styled Components or Compiled',
			url: getRuleUrl('no-styled-tagged-template-expression'),
			externalUrl:
				'https://atlassian.design/components/eslint-plugin-design-system/no-styled-tagged-template-expression/usage',
			recommended: true,
			severity: 'error',
		},
	},
	{
		name: '@compiled/no-suppress-xcss',
		displayName: 'no-suppress-xcss',
		isExternal: true,
		docs: {
			description: 'Disallows supressing type violations when using the xcss prop.',
			url: getRuleUrl('no-suppress-xcss'),
			externalUrl:
				'https://github.com/atlassian-labs/compiled/tree/master/packages/eslint-plugin/src/rules/no-suppress-xcss',
			recommended: true,
			severity: 'error',
		},
	},
	{
		name: '@compiled/no-js-xcss',
		displayName: 'no-js-xcss',
		isExternal: true,
		docs: {
			description: 'Disallows using xcss prop inside JavaScript files.',
			url: getRuleUrl('no-js-xcss'),
			externalUrl:
				'https://github.com/atlassian-labs/compiled/tree/master/packages/eslint-plugin/src/rules/no-js-xcss',
			recommended: true,
			severity: 'error',
		},
	},
	{
		name: '@atlaskit/design-system/no-empty-styled-expression',
		displayName: 'no-empty-styled-expression',
		isExternal: true,
		docs: {
			description:
				'Forbids any styled expression to be used when passing empty arguments to styled.div() (or other JSX elements).',
			url: getRuleUrl('no-empty-styled-expression'),
			externalUrl:
				'https://atlassian.design/components/eslint-plugin-design-system/no-empty-styled-expression/usage',
			recommended: true,
			severity: 'error',
			pluginConfig: { importSources },
		},
	},
	{
		name: '@atlaskit/design-system/no-invalid-css-map',
		displayName: 'no-invalid-css-map',
		isExternal: true,
		docs: {
			description:
				"Checks the validity of a CSS map created through cssMap. This is intended to be used alongside TypeScript's type-checking.",
			url: getRuleUrl('no-invalid-css-map'),
			externalUrl:
				'https://atlassian.design/components/eslint-plugin-design-system/no-invalid-css-map/usage',
			recommended: true,
			severity: 'error',
			pluginConfig: {
				allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
			},
		},
	},
	{
		name: '@compiled/jsx-pragma',
		displayName: 'jsx-pragma',
		isExternal: true,
		docs: {
			description: 'Ensures that the Compiled JSX pragma is set when using Compiled',
			url: getRuleUrl('jsx-pragma'),
			externalUrl:
				'https://github.com/atlassian-labs/compiled/tree/master/packages/eslint-plugin/src/rules/jsx-pragma',
			recommended: true,
			severity: 'error',
			pluginConfig: {
				runtime: 'classic',
				onlyRunIfImportingCompiled: true,
				importSources: ['@atlaskit/css'],
			},
		},
	},
];
