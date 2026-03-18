import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'token',
		description:
			'Design tokens provide consistent, semantic values for colors, spacing, typography, and other design properties across the Atlassian Design System. Use tokens instead of hardcoded values to ensure consistency and proper theming.',
		status: 'general-availability',
		import: {
			name: 'token',
			package: '@atlaskit/tokens',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'AVOID hardcoding any CSS values where a token exists for that type; in many cases you may be forced to use a token',
			'Use the `token()` function with CSS-in-JS',
			'Use semantic token names for better maintainability',
		],
		accessibilityGuidelines: [
			'Use color tokens to ensure proper contrast ratios',
			'Test color combinations for accessibility compliance',
			'Use semantic color names (success, warning, danger) for better meaning',
		],
		examples: [
			{
				name: 'Basic',
				description: 'Basic example',
				source: path.resolve(__dirname, './examples/ai/basic.tsx'),
			},
		],
		keywords: [
			'token',
			'design',
			'system',
			'color',
			'spacing',
			'typography',
			'radius',
			'theme',
			'css',
			'style',
			'variable',
		],
		categories: ['tokens'],
	},
];

export default documentation;
