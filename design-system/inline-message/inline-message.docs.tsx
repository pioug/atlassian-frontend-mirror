import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'InlineMessage',
		description: 'In-context notification for more info, warning, error, or confirmation.',
		status: 'general-availability',
		import: {
			name: 'InlineMessage',
			package: '@atlaskit/inline-message',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for in-context notifications: more info, warning, error, confirmation',
			'Icon/title/secondary can be used to reveal full message in a popup with context/links',
			'Keep content to a maximum of five lines (truncation is not accessible)',
			'Use Flag for minimal interaction; Banner for critical/system; Modal when immediate action is required',
		],
		contentGuidelines: [
			'Use clear, concise message text',
			'Provide specific, actionable feedback',
			'Use appropriate tone for message type',
			'Keep messages focused and relevant',
			'Warning: before action, empathy, offer alternative',
			'Error: explain and next step; use "we" not "you"',
			'Confirmation: confirm, then get out of the way',
			'Information: inform, no action needed',
			'Use clear, concise message text; keep focused and relevant',
		],
		accessibilityGuidelines: [
			'Keep to max five lines—truncation is not accessible',
			'Recommend a title; icon-only is easily missed by screen readers',
			'Use iconLabel when there is no title or when the icon adds context (e.g. error)',
			'Ensure message content is announced by screen readers',
			'Use appropriate message types and colors',
		],
		examples: [
			{
				name: 'Inline Message',
				description: 'Inline Message example',
				source: path.resolve(__dirname, './examples/ai/inline-message.tsx'),
			},
		],
		keywords: ['message', 'inline', 'feedback', 'status', 'alert'],
		categories: ['feedback'],
	},
];

export default documentation;
