import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Blanket',
			description:
				'A component for creating overlay backgrounds behind modals and other layered content. Deprecated: it is not in the browser top layer, so tooltips, popups, flags and dialogs show above it.',
			status: 'deprecated',
			references: {
				figmaUrl: 'https://go.atlassian.com/figma-library-ads-13613-69028',
			},
			import: {
				name: 'Blanket',
				package: '@atlaskit/blanket/blanket',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Do not use in new code. The package is deprecated',
				'For a backdrop behind a modal, use `@atlaskit/modal-dialog`. It has its own backdrop',
				'For a backdrop behind a side panel, use `@atlaskit/drawer`. It has its own backdrop',
				'To close a menu or panel on an outside click, use `@atlaskit/popup`',
				'To block the page while a modal loads, open the modal dialog and show a spinner in it',
				'Do not dim the page behind `@atlaskit/spotlight`. Spotlight does not block the page, by design',
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
					source: `${__dirname}/examples/ai/blanket.tsx`,
				},
			],
			keywords: ['blanket', 'overlay', 'backdrop', 'modal', 'layer'],
			categories: ['overlay'],
		},
	],
};

export default documentation;
