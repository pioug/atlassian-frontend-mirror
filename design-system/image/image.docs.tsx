import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Image',
		description: 'A component for displaying images with theme support.',
		status: 'open-beta',
		import: {
			name: 'Image',
			package: '@atlaskit/image',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for displaying images in content',
			'Provide appropriate alt text',
			'Consider responsive image sizing',
			'Handle loading and error states',
		],
		contentGuidelines: [
			'Use clear, descriptive alt text',
			'Choose appropriate image dimensions',
			'Consider image quality and file size',
			'Use meaningful image content',
		],
		accessibilityGuidelines: [
			'Always provide meaningful alt text',
			'Ensure appropriate image sizing',
			'Consider loading states and error handling',
			'Use appropriate image formats',
		],
		examples: [
			{
				name: 'Image',
				description: 'Image example',
				source: path.resolve(__dirname, './examples/ai/image.tsx'),
			},
		],
		keywords: ['image', 'picture', 'photo', 'visual', 'media'],
		categories: ['data-display'],
	},
];

export default documentation;
