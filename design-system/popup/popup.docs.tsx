import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Popup',
		description: 'A component for displaying popup content relative to a trigger element.',
		status: 'general-availability',
		import: {
			name: 'Popup',
			package: '@atlaskit/popup',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for contextual content that appears on demand',
			'Position appropriately relative to trigger',
			'Consider dismissal behavior',
			'Use appropriate content sizing',
		],
		contentGuidelines: [
			'Keep popup content focused and relevant',
			'Use clear, concise content',
			'Provide appropriate actions when needed',
			'Consider content hierarchy',
		],
		accessibilityGuidelines: [
			'Provide appropriate focus management',
			'Use clear trigger labels',
			'Ensure keyboard navigation support',
			'Provide escape key dismissal',
		],
		examples: [
			{
				name: 'Popup',
				description: 'Popup example',
				source: path.resolve(__dirname, './examples/ai/popup.tsx'),
			},
		],
		keywords: ['popup', 'overlay', 'floating', 'content', 'trigger'],
		categories: ['overlay'],
	},
];

export default documentation;
