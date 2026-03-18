import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'SectionMessage',
		description: 'A component for section-level messages.',
		status: 'general-availability',
		import: {
			name: 'SectionMessage',
			package: '@atlaskit/section-message',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for section-level important info that persists until action or resolution',
			'Use when: destructive consequences, action needed to proceed, connectivity or auth issues',
			'Anatomy: icon+color, title (optional), description, actions (optional)',
			'Use Banner for site-wide; Flag after an event; Inline message for smaller context',
		],
		contentGuidelines: [
			'Title: state the issue or reason',
			'Description: clear, concise, empathetic; use active verbs',
			'Avoid blame—use "we\'re having trouble" not "you\'re having issues"',
			'Provide clear next steps when needed',
		],
		accessibilityGuidelines: [
			'Do not rely on color alone for severity',
			'Avoid dead ends—always indicate how to proceed',
			'Use descriptive link text that describes the destination',
			'Ensure section message content is announced by screen readers',
			'Use appropriate color contrast for text readability',
			'Provide clear, actionable messaging',
			'Consider keyboard navigation for interactive section messages',
		],
		examples: [
			{
				name: 'Section Message',
				description: 'Section Message example',
				source: path.resolve(__dirname, './examples/ai/section-message.tsx'),
			},
		],
		keywords: ['section', 'message', 'alert', 'notification', 'contextual', 'information'],
		categories: ['feedback'],
	},
];

export default documentation;
