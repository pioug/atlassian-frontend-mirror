import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Portal',
			description: 'A component for rendering content outside the normal DOM hierarchy.',
			status: 'deprecated',
			import: {
				name: 'Portal',
				package: '@atlaskit/portal/portal',
				type: 'default',
				packagePath: __dirname,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Deprecated. Do not add new usages. Use a design system layer component (for example Popup, Tooltip or Modal dialog), or `Popover` and `Dialog` from `@atlaskit/top-layer`. These render in the browser top layer, so they need no portal. Content portalled to `document.body` renders below every open top-layer surface.',
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
					source: `${__dirname}/examples/ai/portal.tsx`,
				},
			],
			keywords: ['portal', 'render', 'dom', 'mount', 'teleport'],
			categories: ['utility'],
		},
	],
};

export default documentation;
