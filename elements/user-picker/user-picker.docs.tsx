/**
 * Structured MCP docs for `@atlaskit/user-picker`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/user-picker',
		packagePath,
		packageJson,
		overview:
			'A React component for selecting users, teams, and groups. It provides a searchable dropdown with support for single and multi-select modes, custom options, and external users.',
	},
	components: [
		{
			name: 'UserPicker',
			description: 'The main user picker component.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/user-picker',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `UserPicker` for selecting users or teams in forms and filters; keep `value` controlled when the app needs to save or validate the selection.',
				'Provide a visible label or equivalent accessible name, and use a stable unique `fieldId` for each picker.',
				'Use `isMulti` when multiple selections are part of the task and describe selected values in surrounding form context.',
			],
			keywords: ['user-picker', 'select', 'user', 'team'],
			categories: ['elements'],
			examples: [
				{
					name: 'Controlled single user picker',
					description:
						'Select one user from host-provided options and reflect the controlled value.',
					source: `${packagePath}/examples/ai/user-picker.tsx`,
				},
				{
					name: 'Controlled multi user picker',
					description: 'Select multiple reviewers and reflect the current list.',
					source: `${packagePath}/examples/ai/multi-user-picker.tsx`,
				},
			],
		},
		{
			name: 'PopupUserPicker',
			description:
				'A user picker that opens in a positioned popup connected to a host-provided trigger.',
			status: 'general-availability',
			import: {
				name: 'PopupUserPicker',
				package: '@atlaskit/user-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use to open the picker from a separate button or control. Pass that control through target and give the popup a descriptive popupTitle.',
				'Give the trigger and picker clear accessible names. Keep the selected value in app state and save changes through the app.',
			],
			keywords: ['user-picker', 'popup', 'user', 'team'],
			categories: ['interaction'],
			examples: [
				{
					name: 'Popup user picker',
					description: 'Open a controlled picker from a labelled trigger.',
					source: `${packagePath}/examples/ai/popup-user-picker.tsx`,
				},
			],
		},
		{
			name: 'SingleValue',
			description:
				'The package’s selected-value renderer, which shows the selected person or team with its avatar and supporting status treatment.',
			status: 'general-availability',
			import: {
				name: 'SingleValue',
				package: '@atlaskit/user-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use SingleValue in the UserPicker components map when customizing how selections render.',
				'Pass through the supplied option data and keep the selected person or team recognizable. SingleValue displays a selection; it is not a complete picker.',
			],
			keywords: ['user-picker', 'renderer', 'selected-value'],
			categories: ['data-display'],
			examples: [
				{
					name: 'Reuse the selected-value renderer',
					description: 'Pass the exported renderer through the UserPicker component map.',
					source: `${packagePath}/examples/ai/single-value-renderer.tsx`,
				},
			],
		},
	],
};

export default documentation;
