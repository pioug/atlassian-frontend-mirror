import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

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
				'Use Status for a concise state label such as “In progress” or “Done”.',
				'Choose a color that reinforces the state, but do not make color the only way users can distinguish statuses.',
				'Use StatusPicker to edit the label and color, and save changes in app state.',
			],
			examples: [
				{
					name: 'Status with controlled editor',
					description:
						'Show a status and update its text and color with a controlled StatusPicker.',
					source: `${packagePath}/examples/ai/status-and-picker.tsx`,
				},
			],
			keywords: ['status', 'label', 'badge', 'state', 'lozenge'],
			categories: ['data-display'],
		},
		{
			name: 'StatusPicker',
			description:
				'A picker that lets users edit a free-text status label and choose its color from a palette.',
			status: 'general-availability',
			import: {
				name: 'StatusPicker',
				package: '@atlaskit/status',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use StatusPicker to let users edit a concise status label and its color.',
				'Keep selected text and color in app state: `onTextChanged` and `onColorClick` update the draft, and `onEnter` signals that the user pressed Enter.',
				'Ensure the text communicates status independently of color.',
			],
			examples: [
				{
					name: 'Controlled status editor',
					description: 'Update controlled status text and color and reflect the saved state.',
					source: `${packagePath}/examples/ai/status-and-picker.tsx`,
				},
			],
			keywords: ['status', 'picker', 'select', 'state', 'choice'],
			categories: ['interaction'],
		},
	],
};

export default documentation;
