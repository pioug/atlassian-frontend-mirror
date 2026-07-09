import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Popper',
			description: 'A component for positioning elements relative to other elements.',
			status: 'general-availability',
			designSource: {
				figmaUrl:
					'https://www.figma.com/design/BGz5AdkWe3yTIYdKnTSZuY/ADS-Components?node-id=82088-103357',
			},
			import: {
				name: 'Popper',
				package: '@atlaskit/popper/popper',
				type: 'named',
				packagePath: path.resolve(__dirname),
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use for positioning overlays and tooltips',
				'Consider positioning constraints',
				'Handle responsive positioning',
				'Use appropriate z-index management',
				'Under the platform-dst-top-layer feature flag, Popper renders into the browser top layer via @atlaskit/top-layer. The render-prop ref and placement keep their meaning, but style and arrowProps.style are inert (the browser owns positioning) and the modifiers and strategy props are ignored at runtime.',
			],
			contentGuidelines: [
				'Ensure positioned content is accessible',
				'Use appropriate positioning strategies',
				'Consider content visibility and readability',
			],
			accessibilityGuidelines: [
				'Ensure proper positioning and visibility',
				'Consider screen reader accessibility',
				'Use appropriate ARIA attributes',
				'Handle focus management',
			],
			examples: [
				{
					name: '00 Basic Positioning',
					description: '00 Basic Positioning example',
					source: path.resolve(__dirname, './examples/00-basic-positioning.tsx'),
				},
			],
			keywords: ['popper', 'positioning', 'tooltip', 'popup', 'overlay'],
			categories: ['utility'],
		},
	],
};

export default documentation;
