import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Heading',
		description:
			'A component for creating accessible, consistently styled headings with proper hierarchy. Headings are sized to contrast with content, increase visual hierarchy, and help readers easily understand the structure of content.',
		status: 'general-availability',
		import: {
			name: 'Heading',
			package: '@atlaskit/heading',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use the `HeadingContextProvider` offering to maintain heading levels in complex layouts',
			'Maintain proper heading hierarchy',
			'Keep headings concise and meaningful',
			'Use sentence case for most headings',
			'Use the `color` prop for inverse text on dark backgrounds',
			'Do NOT use any inline styles, you must use the `size` (required) and `color` (optional) props available',
		],
		contentGuidelines: [
			'Use clear, descriptive heading text',
			'Maintain proper heading hierarchy',
			'Keep headings concise and meaningful',
			'Use sentence case for most headings',
			'Make headings descriptive of the content that follows',
		],
		accessibilityGuidelines: [
			'Maintain proper heading hierarchy (h1 to h6)',
			'Use only one h1 per page for main page titles',
			'Ensure minimum 4.5:1 color contrast for text readability',
			'Use clear, descriptive heading text that describes the content below',
		],
		examples: [
			{
				name: 'Basic',
				description: 'Basic example',
				source: path.resolve(__dirname, './examples/ai/basic.tsx'),
			},
		],
		keywords: [
			'heading',
			'title',
			'header',
			'typography',
			'text',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
		],
		categories: ['primitive', 'data-display'],
	},
	{
		name: 'HeadingContextProvider',
		description:
			'A context provider that allows you to configure the default HTML heading level for all headings within its subtree. Useful for maintaining proper heading hierarchy in complex layouts.',
		status: 'general-availability',
		import: {
			name: 'HeadingContextProvider',
			package: '@atlaskit/heading',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Wrap sections that need different heading hierarchy',
			'Use for complex layouts where heading levels need adjustment',
		],
		contentGuidelines: [
			'Ensure proper heading hierarchy is maintained',
			'Use clear, descriptive heading text',
			'Keep headings concise and meaningful',
		],
		examples: [
			{
				name: 'Heading Context Provider',
				description: 'Heading Context Provider example',
				source: path.resolve(__dirname, './examples/ai/heading-context-provider.tsx'),
			},
		],
		keywords: ['heading', 'context', 'provider', 'hierarchy', 'accessibility'],
		categories: ['primitive', 'data-display'],
	},
];

export default documentation;
