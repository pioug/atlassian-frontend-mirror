import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'AtlassianIcon',
		description: 'A component for displaying the Atlassian icon.',
		status: 'general-availability',
		import: {
			name: 'AtlassianIcon',
			package: '@atlaskit/logo',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for Atlassian brand representation',
			'Choose appropriate icon variants',
			'Consider icon sizing and placement',
			'Maintain brand consistency',
		],
		accessibilityGuidelines: [
			'Provide appropriate alt text for the icon',
			'Ensure icon visibility and contrast',
			'Consider icon sizing and placement',
			'Use appropriate icon variants',
		],
		examples: [
			{
				name: 'Atlassian Icon',
				description: 'Atlassian Icon example',
				source: path.resolve(__dirname, './examples/ai/atlassian-icon.tsx'),
			},
		],
		keywords: ['logo', 'brand', 'atlassian', 'identity', 'header'],
		categories: ['brand'],
	},
];

export default documentation;
