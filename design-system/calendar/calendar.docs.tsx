import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Calendar',
		description:
			"A calendar component for date selection and display. This component is in Beta phase, meaning it's stable at version 1.0+ but may receive improvements based on customer feedback.",
		status: 'general-availability',
		import: {
			name: 'Calendar',
			package: '@atlaskit/calendar',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for date selection interfaces',
			'Consider date range limitations',
			'Provide clear visual feedback for selected dates',
			'Handle disabled dates appropriately',
		],
		contentGuidelines: [
			'Use clear date formatting',
			'Provide helpful date labels',
			'Use consistent date terminology',
			'Consider localization for date display (e.g. locale prop, month/day names, first day of week)',
		],
		accessibilityGuidelines: [
			'Provide clear date selection feedback',
			'Ensure keyboard navigation between dates',
			'Use appropriate ARIA labels for dates',
			'Support screen reader announcements for date changes',
		],
		examples: [
			{
				name: 'Calendar',
				description: 'Calendar example',
				source: path.resolve(__dirname, './examples/ai/calendar.tsx'),
			},
		],
		keywords: ['calendar', 'date', 'picker', 'selection', 'month', 'year', 'beta'],
		categories: ['form'],
	},
];

export default documentation;
