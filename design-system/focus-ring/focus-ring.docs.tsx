/**
 * Structured MCP docs for `@atlaskit/focus-ring`.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/focus-ring',
		packagePath,
		packageJson,
		overview:
			'A focus ring clearly indicates which item has keyboard focus. Note that this package is being deprecated in favor of the `Focusable` primitive.',
	},
	components: [
		{
			name: 'FocusRing',
			description: 'A component that wraps an element to provide a consistent focus ring style.',
			status: 'intent-to-deprecate',
			import: {
				name: 'FocusRing',
				package: '@atlaskit/focus-ring/focus-ring',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Wrap interactive elements with `FocusRing` to ensure they have a visible focus state.',
				'Consider migrating to the `Focusable` primitive for new implementations.',
			],
			keywords: ['focus', 'accessibility', 'ring'],
			categories: ['design-system'],
			examples: [
				{
					name: 'Basic focus ring',
					description: 'Basic usage of FocusRing.',
					source: path.resolve(packagePath, './examples/00-basic.tsx'),
				},
			],
		},
	],
};

export default documentation;
