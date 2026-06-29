import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'TaskItem',
			description: 'A component for displaying a single task item with a checkbox and content.',
			status: 'general-availability',
			import: {
				name: 'TaskItem',
				package: '@atlaskit/task-decision',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use TaskItem to represent an individual action item.',
				'Supports marking tasks as complete or incomplete.',
			],
			examples: [
				{
					name: 'Basic Task',
					description: 'Standard task item display.',
					source: path.resolve(packagePath, './examples/02-task-item.tsx'),
				},
			],
			keywords: ['task', 'action-item', 'checkbox', 'todo'],
			categories: ['data-display', 'interaction'],
		},
		{
			name: 'DecisionItem',
			description: 'A component for displaying a single decision item with an icon and content.',
			status: 'general-availability',
			import: {
				name: 'DecisionItem',
				package: '@atlaskit/task-decision',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use DecisionItem to represent a decision made during a meeting or discussion.',
				'Includes a distinctive icon to differentiate it from tasks.',
			],
			examples: [
				{
					name: 'Basic Decision',
					description: 'Standard decision item display.',
					source: path.resolve(packagePath, './examples/00-decision-item.tsx'),
				},
			],
			keywords: ['decision', 'outcome', 'icon', 'meeting-notes'],
			categories: ['data-display'],
		},
	],
};

export default documentation;
