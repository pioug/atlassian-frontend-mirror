import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Code',
		description: 'Use for short code snippets inline with body text.',
		status: 'general-availability',
		import: {
			name: 'Code',
			package: '@atlaskit/code',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for short, inline code snippets with body text',
			'Default styling is overridable',
			'Consider code block vs inline code',
		],
		contentGuidelines: [
			'Use clear, readable code examples',
			'Keep code snippets concise',
			'Use meaningful variable names in examples',
		],
		accessibilityGuidelines: [
			'When overriding styles, ensure contrast ratio ≥ 4.5:1 for text readability',
			'Ensure code content is announced properly by screen readers',
			'Consider code context and meaning',
		],
		examples: [
			{
				name: 'Code',
				description: 'Code example',
				source: path.resolve(__dirname, './examples/ai/code.tsx'),
			},
		],
		keywords: ['code', 'snippet', 'inline', 'syntax', 'programming'],
		categories: ['data-display'],
	},
	{
		name: 'CodeBlock',
		description: 'A component for displaying multi-line code blocks with syntax highlighting.',
		status: 'general-availability',
		import: {
			name: 'CodeBlock',
			package: '@atlaskit/code',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for multi-line code examples',
			'Specify appropriate language for syntax highlighting',
			'Consider code block sizing and scrolling',
			'Use for code snippets that need formatting',
		],
		contentGuidelines: [
			'Use clear, readable code examples',
			'Consider code formatting and indentation',
			'Use meaningful variable names in examples',
			'Keep code blocks focused and relevant',
		],
		accessibilityGuidelines: [
			'Ensure code blocks are announced properly by screen readers',
			'Use appropriate contrast for code readability',
			'Consider code context and meaning',
			'Provide proper language identification',
		],
		examples: [
			{
				name: 'Code Block',
				description: 'Code Block example',
				source: path.resolve(__dirname, './examples/ai/code-block.tsx'),
			},
		],
		keywords: ['code', 'block', 'syntax', 'highlighting', 'multiline'],
		categories: ['data-display'],
	},
];

export default documentation;
