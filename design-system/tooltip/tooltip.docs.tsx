import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Tooltip',
		description:
			'A tooltip is a floating, non-actionable label used to explain a user interface element or feature.',
		status: 'general-availability',
		import: {
			name: 'Tooltip',
			package: '@atlaskit/tooltip',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use only on interactive elements (must be focusable for keyboard and screen readers)',
			'Opens on hover or focus; content is text only',
			'Use with icon buttons for labels; for useful but non-essential info (e.g. shortcuts); for truncated text when truncation is unavoidable',
			'Never use on disabled elements (see Button a11y)',
			'Do not put critical info in tooltip—use labels, helper text, or inline message',
			'No interactive or visual content inside (no links/buttons/icons)—use Popup or Modal',
			'Use Inline message for richer/longer content; Popup/Modal for interactive content',
		],
		contentGuidelines: [
			'Keep concise; do not repeat the visible label',
			'Use helpful, non-essential information only',
			'Icon button and link icon button have their own content guidelines',
		],
		accessibilityGuidelines: [
			'Use only on interactive elements (keyboard focusable; screen reader can reach them)',
			'Never use tooltips on disabled elements',
			'Do not put critical information in tooltips—use visible labels, helper text, or inline message',
			'No links, buttons, or icons inside tooltip—use Popup or Modal for interactive content',
			'Keyboard shortcuts shown in tooltip are not exposed to assistive tech—provide an alternative (e.g. panel, dialog)',
			'Ensure tooltip content is announced by screen readers',
			'Provide keyboard access (hover + focus trigger)',
		],
		examples: [
			{
				name: 'Default Tooltip',
				description: 'Default Tooltip example',
				source: path.resolve(__dirname, './examples/default-tooltip.tsx'),
			},
		],
		keywords: ['tooltip', 'hint', 'help', 'floating', 'label', 'explanation'],
		categories: ['overlays-and-layering'],
	},
];

export default documentation;
