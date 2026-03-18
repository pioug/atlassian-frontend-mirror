import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'EmptyState',
		description:
			'A component for when there is nothing to display (no tasks, cleared inbox, no results).',
		status: 'general-availability',
		import: {
			name: 'EmptyState',
			package: '@atlaskit/empty-state',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when nothing to display in a view (no tasks, no results, cleared inbox)',
			'Header is required; illustration, description, and buttons are optional',
			'Use wide (464px) or narrow (304px) layout as appropriate',
			'Provide one primary CTA; do not stack multiple primary buttons',
			'Use illustration as spot only—do not resize; keep relevant, neutral or humorous',
			'Explain why the state is empty and provide clear next steps',
			'Consider i18n for illustrations (e.g. culturally neutral imagery, translatable alt text)',
		],
		contentGuidelines: [
			'Blank slate: inspirational, motivating tone',
			'All done: celebratory tone',
			'No results: neutral tone with next steps',
			'Use clear, descriptive headers',
			'Provide specific next steps; avoid negative language',
		],
		accessibilityGuidelines: [
			'Avoid jargon; use simple language',
			'Use descriptive link text (not "click here")',
			'Add alt text only if the illustration is meaningful; otherwise omit or mark decorative',
			'Provide clear empty state messaging',
			'Use appropriate headings and structure',
			'Ensure actionable content is accessible',
		],
		examples: [
			{
				name: 'Empty State',
				description: 'Empty State example',
				source: path.resolve(__dirname, './examples/ai/empty-state.tsx'),
			},
		],
		keywords: ['empty', 'state', 'placeholder', 'no-content', 'void'],
		categories: ['status'],
	},
];

export default documentation;
