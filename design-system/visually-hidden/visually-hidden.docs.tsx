import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'VisuallyHidden',
		description:
			'Content hidden from sight but available to screen readers. Use when meaning is clear visually but not to assistive technology.',
		status: 'general-availability',
		import: {
			name: 'VisuallyHidden',
			package: '@atlaskit/visually-hidden',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when meaning is clear visually but not to assistive technology',
			'Avoid clutter—verbose screen-reader-only text can be more harmful than helpful',
			'Use the role prop for semantic meaning when needed',
		],
		contentGuidelines: [
			'Use clear, descriptive hidden content',
			'Ensure content adds value for screen readers',
			'Keep content concise but meaningful',
		],
		accessibilityGuidelines: [
			'Use for screen reader only content when visual context is insufficient for AT',
			'Use role prop for semantic meaning when appropriate',
			'Balance clarity with brevity—avoid overwhelming screen reader users',
			'Prefer over aria-label in some cases when screen readers need to translate or announce full phrasing',
		],
		examples: [
			{
				name: '00 Basic',
				description: '00 Basic example',
				source: path.resolve(__dirname, './examples/00-basic.tsx'),
			},
		],
		keywords: ['hidden', 'accessibility', 'screen-reader', 'aria', 'utility'],
		categories: ['utility'],
	},
];

export default documentation;
