import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'Date',
			description:
				'A component for displaying a formatted date, often used within an editor or task list.',
			status: 'general-availability',
			import: {
				name: 'Date',
				package: '@atlaskit/date',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for compact dates in tasks, releases, or activity. Use a date picker or calendar when people need to choose or compare dates.',
				'Choose a format that matches the surrounding content and is clear in the user’s locale.',
				'Explain statuses such as overdue in nearby text; color can reinforce that meaning.',
			],
			contentGuidelines: [
				'Use a specific, consistent date format and include a year when dates may be read outside the current period.',
			],
			accessibilityGuidelines: [
				'Date uses DateLozenge, which always assigns role="button" to a non-focusable span and adds no keyboard handler, even when onClick is provided. This source has misleading button semantics in both static and interactive use; do not present it as an accessible button.',
			],
			examples: [
				{
					name: 'Basic',
					description: 'Display a release date inline using the component’s default date format.',
					source: `${packagePath}/examples/ai/date-basic.tsx`,
				},
				{
					name: 'Custom format and status color',
					description: 'Use a concise date format and a supporting color cue for an overdue task.',
					source: `${packagePath}/examples/ai/date-custom-format.tsx`,
				},
			],
			keywords: ['date', 'time', 'format', 'calendar'],
			categories: ['data-display'],
		},
		{
			name: 'DateLozenge',
			description:
				'A compact, colored lozenge for displaying a short date label alongside related content.',
			status: 'general-availability',
			import: {
				name: 'DateLozenge',
				package: '@atlaskit/date/date-lozenge',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use DateLozenge for a compact date marker in a sentence or metadata row; use Date when the date itself should be formatted from a timestamp.',
				'Treat the color as a secondary visual cue, not the only way to communicate a date category or status.',
			],
			contentGuidelines: [
				'Keep the label short and include enough date context, such as a month or year, for the surrounding view.',
			],
			accessibilityGuidelines: [
				'DateLozenge always assigns role="button" to a non-focusable span and adds no keyboard handler, even when onClick is provided. This source has misleading button semantics in both static and interactive use; do not present it as an accessible button.',
			],
			examples: [
				{
					name: 'Review milestone',
					description:
						'Show the compact “Review scheduled” label in a sentence. This example is visual only; DateLozenge exposes misleading button semantics without keyboard or focus behavior.',
					source: `${packagePath}/examples/ai/date-lozenge.tsx`,
				},
			],
			keywords: ['date', 'lozenge', 'milestone', 'label', 'status'],
			categories: ['data-display'],
		},
	],
};

export default documentation;
