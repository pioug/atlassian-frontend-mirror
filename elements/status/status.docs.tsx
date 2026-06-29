import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Status',
			description: 'A component for displaying a status label with a background color.',
			status: 'general-availability',
			import: {
				name: 'Status',
				package: '@atlaskit/status',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Status to indicate the current state of an item (e.g., "In Progress", "Done").',
				'Supports various colors to convey different meanings.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Standard status label display.',
					source: path.resolve(packagePath, './examples/00-simple-status.tsx'),
				},
			],
			keywords: ['status', 'label', 'badge', 'state', 'lozenge'],
			categories: ['data-display'],
		},
		{
			name: 'StatusPicker',
			description:
				'A picker component that allows users to select a status from a predefined list.',
			status: 'general-availability',
			import: {
				name: 'StatusPicker',
				package: '@atlaskit/status',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use StatusPicker to allow users to change the status of an item.',
				'Provides a list of available statuses with their associated colors.',
			],
			examples: [
				{
					name: 'Status Picker',
					description: 'Standard status picker example.',
					source: path.resolve(packagePath, './examples/01-status-picker.tsx'),
				},
			],
			keywords: ['status', 'picker', 'select', 'state', 'choice'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
