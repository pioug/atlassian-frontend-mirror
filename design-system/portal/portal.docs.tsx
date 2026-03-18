import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Portal',
		description: 'A component for rendering content outside the normal DOM hierarchy.',
		status: 'general-availability',
		import: {
			name: 'Portal',
			package: '@atlaskit/portal',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for rendering content outside normal DOM',
			'Consider z-index and positioning',
			'Handle focus management appropriately',
			'Use for modals and overlays',
		],
		contentGuidelines: [
			'Ensure portaled content is accessible',
			'Consider content context and purpose',
			'Use appropriate portal placement',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Consider screen reader accessibility',
			'Use appropriate ARIA attributes',
			'Handle keyboard navigation',
		],
		examples: [
			{
				name: 'Portal',
				description: 'Portal example',
				source: path.resolve(__dirname, './examples/ai/portal.tsx'),
			},
		],
		keywords: ['portal', 'render', 'dom', 'mount', 'teleport'],
		categories: ['utility'],
	},
];

export default documentation;
