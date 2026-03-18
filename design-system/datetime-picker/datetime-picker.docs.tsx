import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'DatePicker',
		description: 'A component for selecting date values with calendar support.',
		status: 'general-availability',
		import: {
			name: 'DatePicker',
			package: '@atlaskit/datetime-picker',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for date selection only',
			'Provide clear date formats',
			'Handle date validation appropriately',
			'Consider calendar button visibility',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide helpful placeholder text',
			'Keep labels concise but descriptive',
			'Use locale prop for date format localization',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate date formats',
			'Provide clear date labels',
			'Consider screen reader announcements',
		],
		examples: [
			{
				name: 'Date Picker',
				description: 'Date Picker example',
				source: path.resolve(__dirname, './examples/ai/date-picker.tsx'),
			},
		],
		keywords: ['date', 'picker', 'calendar', 'selection', 'form'],
		categories: ['form'],
	},
	{
		name: 'TimePicker',
		description: 'A component for selecting time values with clock interface.',
		status: 'general-availability',
		import: {
			name: 'TimePicker',
			package: '@atlaskit/datetime-picker',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for time selection only',
			'Provide clear time formats',
			'Handle time validation appropriately',
			'Consider editable time input',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide helpful placeholder text',
			'Use appropriate time formats',
			'Keep labels concise but descriptive',
			'Use locale prop for time format localization (e.g. 12h vs 24h)',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate time formats',
			'Provide clear time labels',
			'Consider screen reader announcements',
		],
		examples: [
			{
				name: 'Time Picker',
				description: 'Time Picker example',
				source: path.resolve(__dirname, './examples/ai/time-picker.tsx'),
			},
		],
		keywords: ['time', 'picker', 'clock', 'selection', 'form'],
		categories: ['form'],
	},
	{
		name: 'DateTimePicker',
		description: 'A component for selecting both date and time values.',
		status: 'general-availability',
		import: {
			name: 'DateTimePicker',
			package: '@atlaskit/datetime-picker',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for combined date and time selection',
			'Provide clear date/time formats',
			'Handle timezone considerations',
			'Consider validation requirements',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide helpful placeholder text',
			'Use appropriate date/time formats',
			'Keep labels concise but descriptive',
			'Use locale prop for date and time format localization',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate date/time formats',
			'Provide clear date/time labels',
			'Consider screen reader announcements',
		],
		examples: [
			{
				name: 'Datetime Picker',
				description: 'Datetime Picker example',
				source: path.resolve(__dirname, './examples/ai/datetime-picker.tsx'),
			},
		],
		keywords: ['datetime', 'picker', 'date', 'time', 'calendar'],
		categories: ['form'],
	},
];

export default documentation;
