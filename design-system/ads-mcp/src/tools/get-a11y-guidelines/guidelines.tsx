// Comprehensive accessibility guidelines based on llms-a11y.txt
export const accessibilityGuidelines = {
	buttons: {
		title: 'Button and Interactive Element Accessibility',
		description: 'Guidelines for making buttons and interactive elements accessible',
		guidelines: [
			'Always provide accessible labels for buttons',
			'Use Button component for standard interactions',
			'Use Focusable component for custom interactive elements',
			'Avoid disabled buttons with tooltips',
			'Ensure focus indicators are visible',
			'Support keyboard navigation (Enter, Space)',
			'Use descriptive labels that explain the action',
		],
		codeExamples: [
			{
				title: 'Accessible Button with Icon',
				code: `import { Button } from '@atlaskit/button';
import { VisuallyHidden } from '@atlaskit/visually-hidden';

<Button aria-label="Close dialog" onClick={handleClose}>
  <CloseIcon />
</Button>`,
			},
			{
				title: 'Custom Interactive Element',
				code: `import { Focusable } from '@atlaskit/primitives/compiled';

<Focusable as="div" onClick={handleClick} onKeyDown={handleKeyDown}>
  Interactive content
</Focusable>`,
			},
		],
		bestPractices: [
			'Never disable buttons without providing alternatives',
			'Use VisuallyHidden for screen reader text',
			'Test with keyboard navigation only',
			'Ensure focus indicators meet contrast requirements',
		],
	},
	forms: {
		title: 'Form and Input Accessibility',
		description: 'Guidelines for making forms and inputs accessible',
		guidelines: [
			'Use TextField component for consistent labeling',
			'Associate labels with inputs using id and htmlFor',
			'Provide clear error messages with aria-describedby',
			'Use MessageWrapper for form validation announcements',
			'Use aria-required for required fields',
			'Group related form elements with fieldset and legend',
		],
		codeExamples: [
			{
				title: 'Accessible Text Field',
				code: `import { TextField } from '@atlaskit/textfield';

<TextField
  label="Email address"
  isRequired
  aria-describedby="email-help"
  id="email-input"
/>
<div id="email-help">Enter your work email address</div>`,
			},
			{
				title: 'Form Validation with Error Messages',
				code: `import { TextField } from '@atlaskit/textfield';

<TextField
  label="Password"
  isInvalid
  aria-invalid="true"
  aria-describedby="password-error"
/>
<div id="password-error" role="alert">
  Password must be at least 8 characters long
</div>`,
			},
		],
		bestPractices: [
			'Never rely on placeholder text for critical information',
			'Provide helpful error messages and descriptions',
			'Use proper form validation with aria-invalid',
			'Test form completion with screen readers',
		],
	},
	images: {
		title: 'Image and Media Accessibility',
		description: 'Guidelines for making images and media accessible',
		guidelines: [
			'Use Image component with proper alt text',
			'Keep alt text under 125 characters',
			'Leave alt="" for decorative images',
			'Describe the purpose, not just the content',
			'Don\'t start with "Image of..." or "Picture of..."',
			'Provide detailed descriptions for complex images',
		],
		codeExamples: [
			{
				title: 'Decorative Image',
				code: `import { Image } from '@atlaskit/image';

<Image src="decorative.jpg" alt="" />`,
			},
			{
				title: 'Informative Image',
				code: `import { Image } from '@atlaskit/image';

<Image
  src="chart.png"
  alt="Bar chart showing Q4 sales increased 25% over Q3"
/>`,
			},
			{
				title: 'Complex Image with Description',
				code: `import { Image } from '@atlaskit/image';

<Image
  src="complex-diagram.png"
  alt=""
  aria-describedby="diagram-description"
/>
<div id="diagram-description">
  Detailed description of the diagram content...
</div>`,
			},
		],
		bestPractices: [
			'For important information, use text instead of images',
			'Avoid images of text',
			'Provide alternative formats for complex visual content',
			'Test with screen readers to ensure proper announcement',
		],
	},
	colors: {
		title: 'Color and Contrast Accessibility',
		description: 'Guidelines for using colors accessibly',
		guidelines: [
			'Use design tokens for consistent contrast ratios',
			'Never rely on color alone for information',
			'Use color.text tokens for proper contrast',
			'Test with high contrast mode',
			'Ensure 4.5:1 contrast ratio for normal text',
			'Ensure 3:1 contrast ratio for large text',
		],
		codeExamples: [
			{
				title: 'Using Design Tokens for Colors',
				code: `import { token } from '@atlaskit/tokens';

const styles = css({
  color: token('color.text'),
  backgroundColor: token('color.background.neutral'),
});`,
			},
			{
				title: 'Text Component with Color',
				code: `import { Text } from '@atlaskit/primitives/compiled';

<Text color="color.text.danger">Error message</Text>
<Text color="color.text.success">Success message</Text>`,
			},
		],
		bestPractices: [
			'Use color.text tokens for primary text',
			'Use color.text.subtle sparingly for secondary text',
			'Avoid color.text.disabled for critical information',
			'Test with different color vision types',
		],
	},
	focus: {
		title: 'Focus Management',
		description: 'Guidelines for proper focus management',
		guidelines: [
			'Ensure logical tab order',
			'Provide visible focus indicators',
			'Handle focus trapping in modals',
			'Return focus when dialogs close',
			'Use Focusable component for custom elements',
			'Manage focus in dynamic content',
		],
		codeExamples: [
			{
				title: 'Focus Management in Modal',
				code: `import { useRef, useEffect } from 'react';

const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen && modalRef.current) {
    modalRef.current.focus();
  }
}, [isOpen]);`,
			},
			{
				title: 'Custom Focusable Element',
				code: `import { Focusable } from '@atlaskit/primitives/compiled';

<Focusable
  as="div"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleActivate();
    }
  }}
>
  Custom focusable element
</Focusable>`,
			},
		],
		bestPractices: [
			'Test focus order with keyboard navigation',
			'Ensure focus indicators are visible in all themes',
			'Handle focus restoration when components unmount',
			'Use focus trapping for modal dialogs',
		],
	},
	keyboard: {
		title: 'Keyboard Accessibility',
		description: 'Guidelines for keyboard accessibility',
		guidelines: [
			'Support standard keyboard interactions',
			'Use Enter and Space for activation',
			'Use Escape for closing/canceling',
			'Support arrow keys for navigation',
			'Provide keyboard shortcuts for power users',
			'Ensure all interactive elements are keyboard accessible',
		],
		codeExamples: [
			{
				title: 'Keyboard Event Handling',
				code: `const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      handleActivate();
      break;
    case 'Escape':
      handleClose();
      break;
    case 'Tab':
      // Handle focus management
      break;
  }
};`,
			},
		],
		bestPractices: [
			'Test with keyboard navigation only',
			'Ensure logical tab order',
			'Provide keyboard alternatives for mouse interactions',
			'Support both Enter and Space for activation',
		],
	},
	screenReaders: {
		title: 'Screen Reader Support',
		description: 'Guidelines for screen reader accessibility',
		guidelines: [
			'Use aria-live regions for dynamic content announcements',
			'Provide skip links for keyboard users',
			'Use proper heading hierarchy',
			'Use semantic HTML elements',
			'Provide live regions for status updates',
			'Use VisuallyHidden for screen reader text',
		],
		codeExamples: [
			{
				title: 'Screen Reader Announcements',
				code: `<div aria-live="polite" role="status">
  {count} items selected
</div>`,
			},
			{
				title: 'Skip Links',
				code: `<a href="#main-content" className="skip-link">
  Skip to main content
</a>`,
			},
		],
		bestPractices: [
			'Test with multiple screen readers (NVDA, JAWS, VoiceOver)',
			'Use aria-live="polite" for status updates',
			'Use aria-live="assertive" for critical alerts',
			'Avoid announcing the same message repeatedly',
		],
	},
	aria: {
		title: 'ARIA Usage Guidelines',
		description: 'Guidelines for using ARIA attributes',
		guidelines: [
			'Use ARIA sparingly - prefer semantic HTML',
			'Use proper ARIA roles and states',
			'Provide live regions for dynamic content',
			'Use landmarks for page structure',
			'Ensure ARIA attributes are supported',
			'Test ARIA implementations with screen readers',
		],
		codeExamples: [
			{
				title: 'Live Region for Status Updates',
				code: `<div aria-live="polite" role="status">
  {statusMessage}
</div>`,
			},
			{
				title: 'Landmark Navigation',
				code: `<nav role="navigation" aria-label="Main navigation">
  Navigation content
</nav>`,
			},
		],
		bestPractices: [
			'Use semantic HTML elements when possible',
			'Test ARIA implementations thoroughly',
			'Keep ARIA usage simple and clear',
			'Document custom ARIA patterns',
		],
	},
	wcag: {
		title: 'WCAG Compliance',
		description: 'WCAG 2.1 AA compliance guidelines',
		guidelines: [
			'Ensure information is perceivable',
			'Make interface components operable',
			'Ensure information is understandable',
			'Make content robust and compatible',
			'Test with multiple assistive technologies',
			'Follow WCAG 2.1 AA success criteria',
		],
		codeExamples: [
			{
				title: 'WCAG Compliant Component',
				code: `// Example of a WCAG compliant button
<Focusable
  as="button"
  aria-label="Save changes"
  onClick={handleSave}
  onKeyDown={handleKeyDown}
>
  <SaveIcon />
  <VisuallyHidden>Save changes</VisuallyHidden>
</Focusable>`,
			},
		],
		bestPractices: [
			'Test with automated accessibility tools',
			'Conduct manual accessibility testing',
			'Test with users who have disabilities',
			'Document accessibility compliance',
		],
	},
	general: {
		title: 'General Accessibility Principles',
		description: 'General accessibility principles and best practices',
		guidelines: [
			'Design for people, not just compliance',
			'Consider accessibility from the start',
			'Test with real users and assistive technologies',
			'Provide multiple ways to accomplish tasks',
			'Use inclusive design principles',
			'Test with different abilities and technologies',
		],
		codeExamples: [
			{
				title: 'Inclusive Design Example',
				code: `// Component that works for everyone
<Focusable
  as="button"
  onClick={handleAction}
  aria-label="Clear form data"
  onKeyDown={handleKeyDown}
>
  <TrashIcon />
  <VisuallyHidden>Clear all form data</VisuallyHidden>
</Focusable>`,
			},
		],
		bestPractices: [
			'Start with semantic HTML',
			'Add ARIA when necessary',
			'Test early and often',
			'Involve users with disabilities in testing',
			'Keep accessibility in mind throughout development',
		],
	},
};
