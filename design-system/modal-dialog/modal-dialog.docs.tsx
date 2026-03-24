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
	{
		name: 'ModalHeader',
		description:
			'The header section of a modal dialog, typically containing the title and optional close button.',
		status: 'general-availability',
		import: {
			name: 'ModalHeader',
			package: '@atlaskit/modal-dialog',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use as the first child of Modal',
			'Use hasCloseButton prop for standard close affordance',
			'Ensure header contains ModalTitle or equivalent for accessibility',
			'For custom headers, use CloseButton as first element in DOM',
		],
		contentGuidelines: ['Use clear, descriptive titles', 'Keep header content focused'],
		examples: [
			{
				name: 'Modal Header',
				description: 'ModalHeader example',
				source: path.resolve(__dirname, './examples/constellation/modal-header-default.tsx'),
			},
		],
		keywords: ['modal', 'header', 'title', 'close'],
		categories: ['overlay'],
	},
	{
		name: 'ModalTitle',
		description: 'The title element for a modal dialog. Renders as h1 for accessibility.',
		status: 'general-availability',
		import: {
			name: 'ModalTitle',
			package: '@atlaskit/modal-dialog',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use inside ModalHeader for the modal title',
			'Modal must have a title for accessibility',
			'Supports any valid React element as children',
		],
		contentGuidelines: ['Use clear, descriptive titles', 'Use sentence case'],
		examples: [
			{
				name: 'Modal Title',
				description: 'ModalTitle example',
				source: path.resolve(__dirname, './examples/constellation/modal-default.tsx'),
			},
		],
		keywords: ['modal', 'title', 'heading'],
		categories: ['overlay'],
	},
	{
		name: 'ModalBody',
		description: 'The main content area of a modal dialog.',
		status: 'general-availability',
		import: {
			name: 'ModalBody',
			package: '@atlaskit/modal-dialog',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for the primary content between header and footer',
			'Accepts any valid React element as children',
			'Handles overflow and scrolling when content exceeds viewport',
		],
		contentGuidelines: ['Keep content focused on a single task', 'Use clear, readable content'],
		examples: [
			{
				name: 'Modal Body',
				description: 'ModalBody example',
				source: path.resolve(__dirname, './examples/constellation/modal-default.tsx'),
			},
		],
		keywords: ['modal', 'body', 'content'],
		categories: ['overlay'],
	},
	{
		name: 'ModalFooter',
		description: 'The footer section of a modal dialog, typically containing action buttons.',
		status: 'general-availability',
		import: {
			name: 'ModalFooter',
			package: '@atlaskit/modal-dialog',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use for primary and secondary actions',
			'Primary button on the right of secondary',
			'Include Cancel/Close for dismissal',
			'Accepts any valid React element for custom layouts',
		],
		contentGuidelines: [
			'Primary button label should reflect the modal title',
			'Use action verbs in button labels',
		],
		examples: [
			{
				name: 'Modal Footer',
				description: 'ModalFooter example',
				source: path.resolve(__dirname, './examples/constellation/modal-footer-default.tsx'),
			},
		],
		keywords: ['modal', 'footer', 'actions', 'buttons'],
		categories: ['overlay'],
	},
	{
		name: 'ModalTransition',
		description: 'A wrapper that provides enter/exit transitions for modal content.',
		status: 'general-availability',
		import: {
			name: 'ModalTransition',
			package: '@atlaskit/modal-dialog',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Wrap Modal with ModalTransition for animated open/close',
			'Use when modal visibility is controlled by state',
			'Children mount when visible and unmount when closed',
		],
		examples: [
			{
				name: 'Modal Transition',
				description: 'ModalTransition example',
				source: path.resolve(__dirname, './examples/constellation/modal-default.tsx'),
			},
		],
		keywords: ['modal', 'transition', 'animation'],
		categories: ['overlay'],
	},
	{
		name: 'CloseButton',
		description:
			'An accessible close button for use in custom modal headers. Ensures users have an obvious way to close the modal.',
		status: 'general-availability',
		import: {
			name: 'CloseButton',
			package: '@atlaskit/modal-dialog',
			type: 'named',
			packagePath: path.resolve(__dirname),
			packageJson: require('./package.json'),
		},
		usageGuidelines: [
			'Use when customizing ModalHeader without hasCloseButton',
			'Render CloseButton first in DOM for proper focus order',
			'Use Flex with row-reverse if close should appear on the right',
			'Provide label prop for custom accessible name',
		],
		accessibilityGuidelines: [
			'Close button is required for modals (consult a11y team for rare exceptions)',
			'Ensure close button is keyboard accessible',
		],
		examples: [
			{
				name: 'Close Button',
				description: 'CloseButton example',
				source: path.resolve(__dirname, './examples/constellation/modal-header-custom.tsx'),
			},
		],
		keywords: ['modal', 'close', 'button', 'dismiss'],
		categories: ['overlay'],
	},
];

export default documentation;
