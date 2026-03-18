import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Flag',
		description: 'A component for displaying brief messages.',
		status: 'general-availability',
		import: {
			name: 'Flag',
			package: '@atlaskit/flag',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for confirmations and alerts needing minimal interaction',
			'Position at bottom left; overlays content',
			'Default: dismissible, event-driven (e.g. avatar update). Bold: not dismissible, severity (success/loading/warning/error), collapsed/expanded',
			'Use Banner for critical/system messages; Inline message when action is required; Modal for immediate action',
		],
		contentGuidelines: [
			'Be clear about what went wrong for errors',
			'Provide specific steps to resolve issues',
			'Use a helpful, non-threatening tone',
			'Clearly state potential consequences for warnings',
			'Confirm outcome then get out of the way for success messages',
			'Information: inform, no action needed',
			'Warning: before action, empathy, offer alternative',
			'Error: explain what went wrong and next step; use "we" not "you"',
			'Success: confirm outcome, then get out of the way; option to view details',
			'Be clear and concise; use a helpful, non-threatening tone',
		],
		accessibilityGuidelines: [
			'Keep copy concise for zoom and long words',
			'Use h2 for title via `headingLevel` prop; maintain heading hierarchy',
			'Do not stack dismissible and non-dismissible flags',
			'Do not rely on color alone for severity',
			'Avoid dead ends—always indicate how to proceed',
			'Do not use auto-dismiss for critical messages',
			'Use descriptive link text that describes the destination',
			'Ensure flag content is announced by screen readers',
			'Consider screen reader announcement conflicts',
		],
		examples: [
			{
				name: 'Flag',
				description: 'Flag example',
				source: path.resolve(__dirname, './examples/ai/flag.tsx'),
			},
		],
		keywords: ['flag', 'message', 'notification', 'alert', 'toast'],
		categories: ['feedback'],
	},
];

export default documentation;
