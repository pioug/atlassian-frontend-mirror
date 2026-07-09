import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'DateLabel',
			description:
				'A date label displays a date as a label, with an optional appearance to communicate a meaningful condition such as a due or overdue date.',
			status: 'open-beta',
			import: {
				name: 'DateLabel',
				package: '@atlaskit/date-label/date-label',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use to display a date as a label on an object (for example a due date), not for entering or selecting a date.',
				'Use the appearance to communicate a meaningful condition: neutral by default, warning for approaching dates, and danger for overdue or critical dates.',
				'A leading icon is shown by default and is appearance-driven (calendar, warning, or danger). Set `hasIconBefore={false}` to hide it.',
				'Use spacious sizing when the date label is displayed alongside buttons.',
				'For entering or selecting a date in a form, use DatePicker from @atlaskit/datetime-picker instead.',
				'If users need to click the date label to change the date via a dropdown, use DateLabelDropdownTrigger instead — it is purpose-built for interactive date switching.',
			],
			contentGuidelines: [
				'Keep the date format concise and consistent with the surrounding experience.',
				'Pair the appearance with a label that makes the condition clear; do not rely on color alone.',
				'Use a single date value per label.',
			],
			accessibilityGuidelines: [
				'Do not rely on color alone to convey a date’s condition; ensure the date text is meaningful on its own.',
				'Ensure sufficient color contrast for the date text across all appearances.',
				'Provide clear, descriptive text for screen readers.',
			],
			examples: [
				{
					name: 'Date label',
					description: 'Basic date label example',
					source: path.resolve(__dirname, './examples/0-basic.tsx'),
				},
			],
			keywords: ['date', 'label', 'date label', 'due date', 'overdue', 'lozenge'],
			categories: ['status-indicators'],
		},
		{
			name: 'DateLabelDropdownTrigger',
			description:
				'Date label dropdown trigger displays a date as a label and enables changing the date through a menu or popup.',
			status: 'open-beta',
			import: {
				name: 'DateLabelDropdownTrigger',
				package: '@atlaskit/date-label/date-label-dropdown-trigger',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use to enable date selection—only open a dropdown or popup to allow changing the date.',
				'Use spacious sizing when displayed alongside buttons.',
				'Do not use to communicate other information about the date; use DateLabel instead for non-interactive date display.',
				'Do not use for date entry in forms; use DatePicker from @atlaskit/datetime-picker instead.',
			],
			contentGuidelines: [
				'Keep the date format concise and consistent with the surrounding experience.',
				'Do not rely on color alone; pair the appearance with clear date text.',
			],
			accessibilityGuidelines: [
				'Do not rely on color alone to convey a date’s condition; ensure the date text is meaningful on its own.',
				'Ensure the trigger is operable by keyboard and exposes an accessible name.',
			],
			examples: [
				{
					name: 'Date label dropdown trigger',
					description: 'DateLabelDropdownTrigger example',
					source: path.resolve(__dirname, './examples/4-dropdown-trigger.tsx'),
				},
			],
			keywords: ['date', 'label', 'dropdown', 'trigger', 'date label', 'menu', 'interactive'],
			categories: ['status-indicators'],
		},
	],
};

export default documentation;
