import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Blanket',
			description:
				'A component for creating overlay backgrounds behind modals and other layered content.',
			status: 'general-availability',
			designSource: {
				figmaUrl: 'https://go.atlassian.com/figma-library-ads-13613-69028',
			},
			import: {
				name: 'Blanket',
				package: '@atlaskit/blanket/blanket',
				type: 'default',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use behind modals and overlays',
				'Consider click-to-dismiss behavior',
				'Use appropriate tinting for context',
				'Ensure proper z-index layering',
			],
			contentGuidelines: [
				'Use consistently across similar overlay contexts',
				'Consider visual hierarchy with overlays',
				'Ensure appropriate contrast with content',
			],
			accessibilityGuidelines: [
				"Ensure blanket doesn't interfere with focus management",
				'Provide appropriate click handling for dismissal',
				'Consider screen reader experience with overlays',
			],
			examples: [
				{
					name: 'Blanket',
					description: 'Blanket example',
					source: path.resolve(__dirname, './examples/ai/blanket.tsx'),
				},
			],
			keywords: ['blanket', 'overlay', 'backdrop', 'modal', 'layer'],
			categories: ['overlay'],
		},
	],
};

export default documentation;
