import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Lozenge',
			description:
				'A lozenge is a prominent, compact label used to communicate a meaningful attribute that affects how people understand, prioritize or act on an object.',
			status: 'general-availability', // beta lozenge is feature-flagged
			import: {
				name: 'Lozenge',
				package: '@atlaskit/lozenge',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use lozenge when a label communicates a meaningful attribute: status, system state, priority, permissions, or a promotional label.',
				'Only migrate a lozenge to Tag when the label is purely categorisation or descriptive metadata (topics, attributes, groupings).',
				"Don't choose lozenge only because Tag lacks a capability; pick the component that matches the label's meaning.",
				'Always combine color with a concise, accurate label.',
				'Use Badge for tallies/scores and Tag for descriptive metadata.',
			],
			contentGuidelines: [
				'Use clear, concise text; use accurate labels (e.g. "Error", "Warning")',
				'Do not use for long text—lozenge is not focusable and truncation at ~200px is not accessible',
				'Ensure text is meaningful and descriptive',
				'Use consistent terminology across lozenges',
			],
			accessibilityGuidelines: [
				'Do not rely on color alone; always pair with an accurate text label',
				'Ensure sufficient color contrast for text readability',
				'Do not use for long text—truncation is not accessible and lozenge is not focusable',
				'Provide appropriate labels for screen readers',
				'Consider color-blind users when choosing colors',
			],
			examples: [
				{
					name: 'Lozenge',
					description: 'Lozenge example',
					source: path.resolve(__dirname, './examples/ai/lozenge.tsx'),
				},
			],
			keywords: ['lozenge', 'badge', 'label', 'status', 'indicator', 'pill'],
			categories: ['status-indicators'],
		},
		{
			name: 'LozengeDropdownTrigger',
			description:
				'Lozenge dropdown trigger enables a lozenge to be interactive, and opens a dropdown to update the selection.',
			status: 'open-beta',
			import: {
				name: 'LozengeDropdownTrigger',
				package: '@atlaskit/lozenge',
				type: 'named',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use for status switching—only open a dropdown or popup to allow quick status changes',
				'Use spacious sizing when displayed alongside buttons',
				"Don't use to communicate other information like additional status details; use lozenge instead",
			],
			contentGuidelines: [
				'Use clear, concise status labels',
				'Keep labels short—max 200px width causes truncation and lozenges are not focusable',
				"Don't use color alone; use clear labels and supporting icons where relevant",
			],
			accessibilityGuidelines: [
				"Don't use color alone to signify state; use clear labels and icons",
				"Don't use long labels—truncation isn't accessible as lozenges can't be focused",
			],
			examples: [
				{
					name: 'Lozenge Dropdown Trigger',
					description: 'LozengeDropdownTrigger example',
					source: path.resolve(
						__dirname,
						'./examples/constellation/lozenge-dropdown-trigger-basic.tsx',
					),
				},
			],
			keywords: ['lozenge', 'dropdown', 'trigger', 'status', 'menu', 'interactive'],
			categories: ['status-indicators'],
		},
	],
};

export default documentation;
