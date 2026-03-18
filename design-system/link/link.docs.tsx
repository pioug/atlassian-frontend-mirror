import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Link',
		description: 'A component for navigation links.',
		status: 'general-availability',
		import: {
			name: 'Link',
			package: '@atlaskit/link',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for navigation to other pages or sections, downloads, or contact (phone, email)',
			'Use default (underlined) with regular text so links are distinguishable',
			'Use subtle appearance only when context already indicates it is a link (e.g. nav, breadcrumbs)',
			'Use Link button when the link should look like a button',
			'Do not open in a new window without warning (e.g. icon or explicit indication)',
		],
		contentGuidelines: [
			'Use clear, descriptive link text that describes the destination',
			'Do not confuse with buttons—links navigate, buttons perform actions',
			"Avoid generic text like 'click here'",
		],
		accessibilityGuidelines: [
			'Do not use subtle appearance with regular body text—default has underline/color for distinguishability',
			'Use subtle only when context already indicates it is a link (e.g. nav, breadcrumbs)',
			'Provide clear link text that describes the destination',
			'Use appropriate ARIA attributes for links',
			'Ensure keyboard navigation support',
			'Provide clear visual indicators for link state',
		],
		examples: [
			{
				name: 'Link',
				description: 'Link example',
				source: path.resolve(__dirname, './examples/ai/link.tsx'),
			},
		],
		keywords: ['link', 'navigation', 'href', 'anchor', 'url'],
		categories: ['navigation'],
	},
];

export default documentation;
