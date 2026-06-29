/**
 * Structured MCP docs for `@atlaskit/feedback-collector`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/feedback-collector',
		packagePath,
		packageJson,
		overview:
			'A component that collects feedback across Atlassian products. It provides a consistent way for users to submit feedback, including bug reports and feature requests.',
	},
	components: [
		{
			name: 'FeedbackCollector',
			description: 'The main component for collecting user feedback.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/feedback-collector',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `FeedbackCollector` to trigger a feedback form from your application.',
				'Provide `onClose` and `onSubmit` handlers to manage the feedback flow.',
			],
			keywords: ['feedback', 'collector', 'atlassian'],
			categories: ['web-platform'],
			examples: [
				{
					name: 'Feedback collector',
					description: 'Basic usage of FeedbackCollector.',
					source: path.resolve(packagePath, './examples/02-feedback-collector.tsx'),
				},
			],
		},
		{
			name: 'FeedbackButton',
			description: 'A button component used to trigger the feedback collector.',
			status: 'general-availability',
			import: {
				name: 'FeedbackButton',
				package: '@atlaskit/feedback-collector',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `FeedbackButton` to provide a consistent trigger for the feedback collector.',
			],
			keywords: ['feedback', 'button', 'trigger'],
			categories: ['web-platform'],
			examples: [
				{
					name: 'Feedback button',
					description: 'Basic usage of FeedbackButton.',
					source: path.resolve(packagePath, './examples/03-feedback-button.tsx'),
				},
			],
		},
	],
};

export default documentation;
