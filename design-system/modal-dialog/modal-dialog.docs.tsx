import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const documentation: ComponentStructuredContentSource[] = [
	{
		name: 'Modal',
		description: 'A modal dialog component for important content.',
		status: 'general-availability',
		import: {
			name: 'Modal',
			package: '@atlaskit/modal-dialog',
			type: 'default',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for immediate task or critical/warning requiring a response; blocking until closed',
			'Use sparingly—modals are invasive',
			'One task per modal; limit interactions; no nested modals (inaccessible)',
			'Anatomy: header (h1 title), close button, body, footer with primary + cancel/close',
			'Footer: primary button on the right of secondary; multiple dismissal methods (close button, Esc, blanket click, Cancel/Close)',
			'Use Popup for smaller info + controls; Spotlight for onboarding; Inline message for alert/action',
		],
		contentGuidelines: [
			'Use clear, descriptive titles',
			'Primary button label should reflect the modal title',
			'Use action verbs in button labels',
			'Keep content focused on a single task or message',
			'Use sentence case for all text',
		],
		accessibilityGuidelines: [
			'Modal must have a title: use title component, or titleId from useModal, or label (avoid if no visual title)',
			'Close button is required (except rare cases—consult a11y team)',
			'Do not rely on color alone for severity; provide accessible label for icons',
			'Focus order: 1) close (or title or container), 2) first focusable, 3) secondary button, 4) primary, 5) return focus to trigger on close',
			'Dismiss via: close button, Esc, click blanket, Cancel/Close in footer',
			'Ensure modal content is announced by screen readers',
			'Ensure keyboard navigation and escape key support',
			'Maintain focus within modal when open',
		],
		examples: [
			{
				name: 'Default',
				description: 'The default form of a modal dialog.',
				source: path.resolve(__dirname, './examples/constellation/modal-default.tsx'),
			},
		],
		keywords: ['modal', 'dialog', 'popup', 'overlay', 'focused', 'interaction', 'layer'],
		categories: ['overlay'],
	},
];

export default documentation;
