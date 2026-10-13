import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Filmstrip',
			description:
				'A component that displays a collection of media cards in a horizontal, scrollable filmstrip layout.',
			status: 'general-availability',
			import: {
				name: 'Filmstrip',
				package: '@atlaskit/media-filmstrip',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use Filmstrip to show a horizontal list of media items, such as attachments or gallery previews.',
				'Provides navigation arrows for scrolling through the items.',
				'Automatically handles layout and spacing of media cards.',
			],
			examples: [
				{
					name: 'Media attachments',
					description:
						'Display host-provided media files in a horizontal strip with media-viewer integration.',
					source: `${packagePath}/examples/ai/filmstrip.tsx`,
				},
			],
			keywords: ['media', 'filmstrip', 'gallery', 'carousel', 'horizontal-scroll'],
			categories: ['media', 'layout'],
			accessibilityGuidelines: [
				'Give every media item a name users can identify independently of its position in the horizontal strip.',
				'Keep item actions reachable when content overflows horizontally, and ensure the filmstrip does not become the only way to access important file information.',
			],
			contentGuidelines: [
				'Use descriptive file names or concise item labels so users can distinguish attachments as they move through the strip.',
			],
		},
		{
			name: 'FilmstripView',
			description:
				'A presentational horizontal scroller for caller-rendered children. Use it when the host already owns item rendering and scroll state.',
			status: 'general-availability',
			import: {
				name: 'FilmstripView',
				package: '@atlaskit/media-filmstrip',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Choose `FilmstripView` when your application needs to render custom children or manage the scroll offset itself; choose `Filmstrip` for media identifiers rendered as media cards.',
			],
			accessibilityGuidelines: [
				'Ensure each child has an accessible name and that users can reach its actions independently of the filmstrip arrows.',
			],
			contentGuidelines: [
				'Give each item a concise, distinguishing file name or label so people can identify it while scrolling.',
			],
			examples: [
				{
					name: 'Custom filmstrip content',
					description: 'Render and select caller-owned cards in the FilmstripView scroller.',
					source: `${packagePath}/examples/ai/filmstrip-view.tsx`,
				},
			],
			keywords: ['media', 'horizontal scroller', 'filmstrip view', 'custom content'],
			categories: ['media', 'layout'],
		},
		{
			name: 'LeftArrow',
			description:
				'A left-direction arrow control for moving through horizontally overflowing media content.',
			status: 'general-availability',
			import: {
				name: 'LeftArrow',
				package: '@atlaskit/media-filmstrip',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use directional arrow controls only when there is additional content to reveal in that direction.',
			],
			accessibilityGuidelines: [
				'Keep the arrow control operable by keyboard and preserve a visible focus indicator.',
			],
			examples: [
				{
					name: 'Filmstrip direction controls',
					description: 'Use left and right controls to change the visible host-managed attachment.',
					source: `${packagePath}/examples/ai/filmstrip-arrows.tsx`,
				},
			],
			keywords: ['filmstrip previous', 'left arrow', 'horizontal navigation'],
			categories: ['media', 'navigation'],
		},
		{
			name: 'RightArrow',
			description:
				'A right-direction arrow control for moving through horizontally overflowing media content.',
			status: 'general-availability',
			import: {
				name: 'RightArrow',
				package: '@atlaskit/media-filmstrip',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use directional arrow controls only when there is additional content to reveal in that direction.',
			],
			accessibilityGuidelines: [
				'Keep the arrow control operable by keyboard and preserve a visible focus indicator.',
			],
			examples: [
				{
					name: 'Filmstrip direction controls',
					description: 'Use left and right controls to change the visible host-managed attachment.',
					source: `${packagePath}/examples/ai/filmstrip-arrows.tsx`,
				},
			],
			keywords: ['filmstrip next', 'right arrow', 'horizontal navigation'],
			categories: ['media', 'navigation'],
		},
	],
};

export default documentation;
