import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'css',
		description: 'A typed variant of Compiled CSS-in-JS adhering to the Atlassian Design System.',
		status: 'open-beta',
		import: {
			name: 'css',
			package: '@atlaskit/css',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Prefer `cssMap` for CSS-in-JS styling',
			"Use typescript to infer most things, eg. which media queries you're allowed to use",
			'If the typescript bounding is too restrictive, you can use the `@compiled/react` library instead',
		],
		examples: [
			{
				name: 'Css',
				description: 'Css example',
				source: path.resolve(__dirname, './examples/ai/css.tsx'),
			},
		],
		keywords: ['css', 'styles', 'theme', 'styling', 'utilities'],
		categories: ['utility'],
	},
	{
		name: 'cssMap',
		description: 'A typed variant of Compiled CSS-in-JS adhering to the Atlassian Design System.',
		status: 'open-beta',
		import: {
			name: 'cssMap',
			package: '@atlaskit/css',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'This is the primary way to define styles in a more structured manner than `css`',
			"Use typescript to infer most things, eg. which media queries you're allowed to use",
			'If the typescript bounding is too restrictive, you can use the `@compiled/react` library instead',
			'You MUST use this when working with an `xcss` prop as `css` does not work there',
		],
		examples: [
			{
				name: 'Css Map',
				description: 'Css Map example',
				source: path.resolve(__dirname, './examples/ai/css-map.tsx'),
			},
		],
		keywords: ['css', 'styles', 'theme', 'styling', 'utilities'],
		categories: ['utility'],
	},
	{
		name: 'cx',
		description: 'A function for combining styles in an `xcss` prop to maintain correct typing.',
		status: 'open-beta',
		import: {
			name: 'cx',
			package: '@atlaskit/css',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use this to combine styles in an `xcss` prop to maintain correct typing, eg. `cx(styles.root, styles.bordered)`',
			'This is not required for native elements which should use `[]` instead, eg. `[styles.root, styles.bordered]`',
		],
		examples: [
			{
				name: 'Cx',
				description: 'Cx example',
				source: path.resolve(__dirname, './examples/ai/cx.tsx'),
			},
		],
		keywords: ['css', 'styles', 'theme', 'styling', 'utilities'],
		categories: ['utility'],
	},
];

export default documentation;
