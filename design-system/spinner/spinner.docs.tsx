import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Spinner',
			description: 'A loading spinner component.',
			status: 'general-availability',
			designSource: {
				figmaUrl: 'https://go.atlassian.com/figma-library-ads-8070-10241',
			},
			import: {
				name: 'Spinner',
				package: '@atlaskit/spinner/spinner',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use for loading states of unknown duration',
				'Consider delay before showing spinner',
				'Use appropriate size for context',
				'Provide loading context when possible',
			],
			contentGuidelines: [
				'Use consistent spinner sizing',
				'Consider spinner placement and context',
				'Provide loading feedback when appropriate',
			],
			accessibilityGuidelines: [
				'Provide appropriate loading announcements',
				'Use appropriate timing for spinner display',
				'Ensure spinner is announced to screen readers',
				'Consider alternative loading indicators',
			],
			examples: [
				{
					name: 'Spinner',
					description: 'Spinner example',
					source: `${__dirname}/examples/ai/spinner.tsx`,
				},
			],
			keywords: ['spinner', 'loading', 'busy', 'progress', 'wait', 'activity'],
			categories: ['feedback'],
		},
	],
};

export default documentation;
