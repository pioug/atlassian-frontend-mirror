import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Banner',
		description:
			'A banner displays a prominent message at the top of the screen to communicate important information to users.',
		status: 'general-availability',
		import: {
			name: 'Banner',
			package: '@atlaskit/banner',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use only for critical messaging: loss of data/functionality or important site-wide information',
			'Show one banner at a time and push content down',
			'Place at the top of the screen for maximum visibility',
			'Keep messaging concise and actionable',
			'Consider dismissibility for non-critical messages',
			'Use Flag for confirmations or minimal interaction; use Inline message when action is required',
		],
		contentGuidelines: [
			'Use "we" not "you" in error messages',
			'Write clear, concise, scannable messages',
			'Include follow-up actions where relevant',
			'Use action-oriented language when appropriate',
			'Ensure messages are relevant to the current context',
		],
		accessibilityGuidelines: [
			'Do not rely on color alone for severity; provide accessible label for warning/error icons',
			'Alert role is a live region and very noisy—use only when the message is very important',
			'Keep content concise to avoid truncation (truncation is not accessible)',
			'Use appropriate color contrast for text readability',
			'Provide clear, actionable messaging',
			'Consider keyboard navigation for interactive banners',
		],
		examples: [
			{
				name: '00 Basic Usage',
				description: '00 Basic Usage example',
				source: path.resolve(__dirname, './examples/00-basic-usage.tsx'),
			},
		],
		keywords: ['banner', 'message', 'notification', 'alert', 'prominent', 'top', 'screen'],
		categories: ['messaging'],
	},
];

export default documentation;
