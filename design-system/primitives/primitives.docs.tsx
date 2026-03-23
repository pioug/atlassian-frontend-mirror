import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Anchor',
		description: 'A primitive Anchor component for navigation links with compiled styling support.',
		status: 'general-availability',
		import: {
			name: 'Anchor',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for navigation links to other pages or sections',
			'Leverage compiled styling for performance',
			'Use appropriate link styling and states',
			'Consider link behavior and target attributes',
		],
		contentGuidelines: [
			'Use clear, descriptive link text',
			'Maintain consistent link styling',
			'Consider link context and destination',
		],
		accessibilityGuidelines: [
			'Provide clear link text that describes the destination',
			'Use appropriate ARIA attributes for links',
			'Ensure keyboard navigation support',
			'Provide clear visual indicators for link state',
			'Use descriptive link text for screen readers',
		],
		examples: [
			{
				name: 'Anchor',
				description: 'Anchor example',
				source: path.resolve(__dirname, './examples/ai/anchor.tsx'),
			},
		],
		keywords: ['anchor', 'link', 'navigation', 'href', 'url', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Bleed',
		description:
			'A primitive Bleed component for extending content beyond container boundaries with compiled styling support.',
		status: 'general-availability',
		import: {
			name: 'Bleed',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for extending content beyond container margins',
			'Leverage compiled styling for performance',
			'Use appropriate bleed directions and amounts',
			'Consider responsive behavior and container constraints',
		],
		contentGuidelines: [
			'Use for appropriate layout bleeding',
			'Maintain consistent bleeding patterns',
			'Consider content hierarchy and visual flow',
		],
		examples: [
			{
				name: 'Bleed',
				description: 'Bleed example',
				source: path.resolve(__dirname, './examples/ai/bleed.tsx'),
			},
		],
		keywords: ['bleed', 'layout', 'margin', 'spacing', 'edge', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Box',
		description:
			'A primitive Box component for layout and container purposes with compiled styling support.',
		status: 'general-availability',
		import: {
			name: 'Box',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for basic layout and container needs',
			'Leverage compiled styling for performance',
			'Use appropriate spacing and layout props',
			'Consider semantic HTML when possible',
		],
		contentGuidelines: [
			'Use for appropriate layout purposes',
			'Maintain consistent spacing and layout patterns',
			'Consider accessibility and semantic structure',
		],
		examples: [
			{
				name: 'Box',
				description: 'Box example',
				source: path.resolve(__dirname, './examples/ai/box.tsx'),
			},
		],
		keywords: ['box', 'container', 'div', 'layout', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Flex',
		description: 'A primitive Flex component for flexbox layout with compiled styling support.',
		status: 'open-beta',
		import: {
			name: 'Flex',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for flexbox layout needs',
			'Leverage compiled styling for performance',
			'Use appropriate flex properties and alignment',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use for appropriate flex layout',
			'Maintain consistent flex patterns',
			'Consider content alignment and distribution',
		],
		examples: [
			{
				name: 'Flex',
				description: 'Flex example',
				source: path.resolve(__dirname, './examples/ai/flex.tsx'),
			},
		],
		keywords: ['flex', 'layout', 'flexbox', 'alignment', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Focusable',
		description:
			'A primitive Focusable component for keyboard navigation and focus management with compiled styling support.',
		status: 'general-availability',
		import: {
			name: 'Focusable',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for elements that need keyboard focus',
			'Leverage compiled styling for performance',
			'Use appropriate focus management',
			'Consider keyboard navigation patterns',
		],
		contentGuidelines: [
			'Use for appropriate focusable content',
			'Maintain consistent focus patterns',
			'Consider keyboard navigation flow',
		],
		accessibilityGuidelines: [
			'Provide clear focus indicators',
			'Use appropriate tab order and navigation',
			'Ensure keyboard accessibility',
			'Provide clear visual feedback for focus state',
			'Use appropriate ARIA attributes',
		],
		examples: [
			{
				name: 'Focusable',
				description: 'Focusable example',
				source: path.resolve(__dirname, './examples/ai/focusable.tsx'),
			},
		],
		keywords: [
			'focusable',
			'focus',
			'keyboard',
			'navigation',
			'accessibility',
			'primitive',
			'compiled',
		],
		categories: ['primitive'],
	},
	{
		name: 'Grid',
		description: 'A primitive Grid component for CSS Grid layout with compiled styling support.',
		status: 'open-beta',
		import: {
			name: 'Grid',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for CSS Grid layout needs',
			'Leverage compiled styling for performance',
			'Use appropriate grid properties and alignment',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use for appropriate grid layout',
			'Maintain consistent grid patterns',
			'Consider content alignment and distribution',
		],
		examples: [
			{
				name: 'Grid',
				description: 'Grid example',
				source: path.resolve(__dirname, './examples/ai/grid.tsx'),
			},
		],
		keywords: ['grid', 'layout', 'css-grid', 'alignment', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Inline',
		description: 'A primitive Inline component for horizontal layout with consistent spacing.',
		status: 'general-availability',
		import: {
			name: 'Inline',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for horizontal layout needs',
			'Leverage compiled styling for performance',
			'Use appropriate spacing and alignment props',
			'Consider wrapping behavior',
		],
		contentGuidelines: [
			'Use for appropriate horizontal grouping',
			'Maintain consistent spacing patterns',
			'Consider content flow and readability',
		],
		examples: [
			{
				name: 'Inline',
				description: 'Inline example',
				source: path.resolve(__dirname, './examples/ai/inline.tsx'),
			},
		],
		keywords: ['inline', 'layout', 'horizontal', 'spacing', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'MetricText',
		description: 'A primitive Text component for typography with compiled styling support.',
		status: 'general-availability',
		import: {
			name: 'MetricText',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for text content with consistent typography',
			'Leverage compiled styling for performance',
			'Use appropriate font size and weight props',
			'Consider semantic HTML elements',
		],
		contentGuidelines: [
			'Use for appropriate text content',
			'Maintain consistent typography patterns',
			'Consider readability and hierarchy',
		],
		examples: [
			{
				name: 'Metric Text',
				description: 'Metric Text example',
				source: path.resolve(__dirname, './examples/ai/metric-text.tsx'),
			},
		],
		keywords: ['text', 'typography', 'font', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Pressable',
		description:
			'A primitive Pressable component for handling touch and click interactions with compiled styling support.',
		status: 'general-availability',
		import: {
			name: 'Pressable',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for interactive elements that need press feedback',
			'Leverage compiled styling for performance',
			'Use appropriate press states and feedback',
			'Consider touch target accessibility',
		],
		contentGuidelines: [
			'Use for appropriate interactive content',
			'Maintain consistent press patterns',
			'Consider user interaction expectations',
		],
		accessibilityGuidelines: [
			'Provide clear visual feedback for press states',
			'Ensure appropriate touch target sizes',
			'Use appropriate ARIA attributes for interactive elements',
			'Provide keyboard navigation support',
		],
		examples: [
			{
				name: 'Pressable',
				description: 'Pressable example',
				source: path.resolve(__dirname, './examples/ai/pressable.tsx'),
			},
		],
		keywords: ['pressable', 'interaction', 'touch', 'click', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Stack',
		description:
			'A primitive Stack component for vertical and horizontal layout with consistent spacing.',
		status: 'general-availability',
		import: {
			name: 'Stack',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for consistent vertical or horizontal layouts',
			'Leverage compiled styling for performance',
			'Use appropriate spacing and alignment props',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use for appropriate layout grouping',
			'Maintain consistent spacing patterns',
			'Consider content hierarchy and flow',
		],
		examples: [
			{
				name: 'Stack',
				description: 'Stack example',
				source: path.resolve(__dirname, './examples/ai/stack.tsx'),
			},
		],
		keywords: ['stack', 'layout', 'vertical', 'horizontal', 'spacing', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
	{
		name: 'Text',
		description: 'A primitive Text component for typography with compiled styling support.',
		status: 'general-availability',
		import: {
			name: 'Text',
			package: '@atlaskit/primitives/compiled',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for text content with consistent typography',
			'Leverage compiled styling for performance',
			'Use appropriate font size and weight props',
			'Consider semantic HTML elements',
		],
		contentGuidelines: [
			'Use for appropriate text content',
			'Maintain consistent typography patterns',
			'Consider readability and hierarchy',
		],
		examples: [
			{
				name: 'Text',
				description: 'Text example',
				source: path.resolve(__dirname, './examples/ai/text.tsx'),
			},
		],
		keywords: ['text', 'typography', 'font', 'primitive', 'compiled'],
		categories: ['primitive'],
	},
];

export default documentation;
