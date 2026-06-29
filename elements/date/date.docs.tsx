import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Date',
			description:
				'A component for displaying a formatted date, often used within an editor or task list.',
			status: 'general-availability',
			import: {
				name: 'Date',
				package: '@atlaskit/date',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Date to display a date in a consistent format.',
				'Supports custom colors to indicate status (e.g., overdue).',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard date display.',
					source: path.resolve(packagePath, './examples/00-custom-colors.tsx'),
				},
			],
			keywords: ['date', 'time', 'format', 'calendar'],
			categories: ['data-display'],
		},
	],
};

export default documentation;
