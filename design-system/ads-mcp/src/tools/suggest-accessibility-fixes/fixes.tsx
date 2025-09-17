export interface FixSuggestion {
	title: string;
	description: string;
	before: string;
	after: string;
	explanation: string;
}

export interface AccessibilityFix {
	title: string;
	description: string;
	fixes: FixSuggestion[];
	bestPractices: string[];
}

export interface AccessibilityFixCategory {
	[key: string]: AccessibilityFix;
}

// Comprehensive fix suggestions for common accessibility violations
export const accessibilityFixes: AccessibilityFixCategory = {
	'button missing label': {
		title: 'Button Missing Accessible Label',
		description: 'Buttons need accessible labels for screen readers',
		fixes: [
			{
				title: 'Use aria-label prop',
				description: 'Add aria-label for icon-only buttons',
				before: `<button onClick={handleClose}>
  <CloseIcon />
</button>`,
				after: `import { Button } from '@atlaskit/button';

<Button aria-label="Close dialog" onClick={handleClose}>
  <CloseIcon />
</Button>`,
				explanation:
					'The aria-label provides a text description for screen readers while keeping the visual design clean.',
			},
			{
				title: 'Use VisuallyHidden component',
				description: 'Add screen reader text while keeping visual design',
				before: `<button onClick={handleSave}>
  <SaveIcon />
</button>`,
				after: `import { Button } from '@atlaskit/button';
import { VisuallyHidden } from '@atlaskit/visually-hidden';

<Button onClick={handleSave}>
  <SaveIcon />
  <VisuallyHidden>Save changes</VisuallyHidden>
</Button>`,
				explanation: 'VisuallyHidden makes text available to screen readers but hides it visually.',
			},
		],
		bestPractices: [
			'Always provide descriptive labels',
			'Use aria-label for icon-only buttons',
			'Use VisuallyHidden for additional context',
			'Test with screen readers',
		],
	},
	'image missing alt': {
		title: 'Image Missing Alt Text',
		description: 'Images need alt text for screen readers',
		fixes: [
			{
				title: 'Add descriptive alt text',
				description: 'Provide meaningful alt text for informative images',
				before: `<img src="chart.png" />`,
				after: `import { Image } from '@atlaskit/image';

<Image
  src="chart.png"
  alt="Bar chart showing Q4 sales increased 25% over Q3"
/>`,
				explanation: 'Alt text should describe the purpose and content of the image.',
			},
			{
				title: 'Empty alt for decorative images',
				description: 'Use empty alt for purely decorative images',
				before: `<img src="decorative.jpg" />`,
				after: `import { Image } from '@atlaskit/image';

<Image src="decorative.jpg" alt="" />`,
				explanation: 'Empty alt tells screen readers to skip decorative images.',
			},
		],
		bestPractices: [
			'Keep alt text under 125 characters',
			'Describe purpose, not just content',
			'Use empty alt for decorative images',
			'Don\'t start with "Image of..."',
		],
	},
	'clickable div': {
		title: 'Clickable Div Without Accessibility',
		description: 'Div elements with click handlers need proper accessibility',
		fixes: [
			{
				title: 'Use Focusable component',
				description: 'Convert to accessible interactive element',
				before: `<div onClick={handleClick}>
  Interactive content
</div>`,
				after: `import { Focusable } from '@atlaskit/primitives/compiled';

<Focusable
  as="div"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Interactive content
</Focusable>`,
				explanation: 'Focusable provides keyboard navigation and focus management.',
			},
			{
				title: 'Use Button component',
				description: 'Convert to semantic button element',
				before: `<div onClick={handleClick}>
  Click me
</div>`,
				after: `import { Button } from '@atlaskit/button';

<Button onClick={handleClick}>
  Click me
</Button>`,
				explanation: 'Button provides full accessibility out of the box.',
			},
		],
		bestPractices: [
			'Use semantic HTML elements when possible',
			'Add keyboard support for custom elements',
			'Ensure focus indicators are visible',
			'Test with keyboard navigation',
		],
	},
	'input missing label': {
		title: 'Input Missing Associated Label',
		description: 'Input elements need associated labels',
		fixes: [
			{
				title: 'Use TextField component',
				description: 'Use ADS TextField for automatic labeling',
				before: `<input type="email" />`,
				after: `import { TextField } from '@atlaskit/textfield';

<TextField
  label="Email address"
  type="email"
  id="email-input"
/>`,
				explanation: 'TextField handles label association automatically.',
			},
			{
				title: 'Manual label association',
				description: 'Associate label with input using id and htmlFor',
				before: `<input type="email" />
<label>Email address</label>`,
				after: `<label htmlFor="email-input">Email address</label>
<input
  type="email"
  id="email-input"
  aria-describedby="email-help"
/>
<div id="email-help">Enter your work email address</div>`,
				explanation: 'Use id and htmlFor to associate labels with inputs.',
			},
		],
		bestPractices: [
			'Always associate labels with inputs',
			'Use descriptive label text',
			'Provide helpful descriptions',
			'Test with screen readers',
		],
	},
	'hardcoded colors': {
		title: 'Hardcoded Color Values',
		description: 'Hardcoded colors may not meet contrast requirements',
		fixes: [
			{
				title: 'Use design tokens',
				description: 'Replace hardcoded colors with design tokens',
				before: `color: '#ff0000'`,
				after: `import { token } from '@atlaskit/tokens';

color: token('color.text.danger')`,
				explanation: 'Design tokens ensure consistent contrast ratios.',
			},
			{
				title: 'Use Text component',
				description: 'Use Text component with color prop',
				before: `<span style={{ color: '#ff0000' }}>Error message</span>`,
				after: `import { Text } from '@atlaskit/primitives/compiled';

<Text color="color.text.danger">Error message</Text>`,
				explanation: 'Text component handles color and contrast automatically.',
			},
		],
		bestPractices: [
			'Use design tokens for all colors',
			'Test contrast ratios',
			"Don't rely on color alone",
			'Test with high contrast mode',
		],
	},
	'missing focus indicator': {
		title: 'Missing Focus Indicator',
		description: 'Interactive elements need visible focus indicators',
		fixes: [
			{
				title: 'Use Focusable component',
				description: 'Focusable provides built-in focus indicators',
				before: `<div onClick={handleClick}>
  Interactive content
</div>`,
				after: `import { Focusable } from '@atlaskit/primitives/compiled';

<Focusable as="div" onClick={handleClick}>
  Interactive content
</Focusable>`,
				explanation: 'Focusable includes visible focus indicators.',
			},
			{
				title: 'Custom focus styles',
				description: 'Add custom focus styles with xcss',
				before: `<button onClick={handleClick}>
  Click me
</button>`,
				after: `import { Focusable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

<Focusable
  as="button"
  onClick={handleClick}
  xcss={{
    ':focus-visible': {
      outline: \`$\{token('border.width.focused')} solid $\{token('color.border.focused')}\`,
      outlineOffset: token('space.025'),
    },
  }}
>
  Click me
</Focusable>`,
				explanation: 'Custom focus styles ensure visibility in all themes.',
			},
		],
		bestPractices: [
			'Always provide visible focus indicators',
			'Test focus indicators in all themes',
			'Ensure sufficient contrast for focus indicators',
			'Test with keyboard navigation',
		],
	},
	'form validation': {
		title: 'Form Validation Accessibility',
		description: 'Form validation needs proper accessibility support',
		fixes: [
			{
				title: 'Use TextField with validation',
				description: 'TextField provides built-in validation support',
				before: `<input type="password" />
<div>Password too short</div>`,
				after: `import { TextField } from '@atlaskit/textfield';

<TextField
  type="password"
  label="Password"
  isInvalid
  aria-invalid="true"
  aria-describedby="password-error"
/>
<div id="password-error" role="alert">
  Password must be at least 8 characters long
</div>`,
				explanation:
					'TextField with aria-invalid and aria-describedby provides proper validation feedback.',
			},
			{
				title: 'Use MessageWrapper',
				description: 'MessageWrapper for form validation announcements',
				before: `<input type="email" />
<div>Invalid email format</div>`,
				after: `import { TextField } from '@atlaskit/textfield';
import { MessageWrapper } from '@atlaskit/form';

<MessageWrapper>
  <TextField
    type="email"
    label="Email"
    isInvalid
    aria-describedby="email-error"
  />
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
</MessageWrapper>`,
				explanation: 'MessageWrapper provides proper announcement of validation messages.',
			},
		],
		bestPractices: [
			'Use aria-invalid for validation state',
			'Provide clear error messages',
			'Use role="alert" for important messages',
			'Test validation with screen readers',
		],
	},
	'keyboard navigation': {
		title: 'Missing Keyboard Navigation',
		description: 'Interactive elements need keyboard support',
		fixes: [
			{
				title: 'Add keyboard event handlers',
				description: 'Support Enter and Space for activation',
				before: `<div onClick={handleClick}>
  Click me
</div>`,
				after: `import { Focusable } from '@atlaskit/primitives/compiled';

<Focusable
  as="div"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</Focusable>`,
				explanation: 'Keyboard handlers make elements accessible to keyboard users.',
			},
			{
				title: 'Use Button component',
				description: 'Button provides full keyboard support',
				before: `<div onClick={handleClick}>
  Submit
</div>`,
				after: `import { Button } from '@atlaskit/button';

<Button onClick={handleClick}>
  Submit
</Button>`,
				explanation: 'Button supports Enter, Space, and other keyboard interactions.',
			},
		],
		bestPractices: [
			'Support Enter and Space for activation',
			'Support Escape for closing/canceling',
			'Ensure logical tab order',
			'Test with keyboard navigation only',
		],
	},
	'form missing label': {
		title: 'Form Input Missing Label',
		description: 'Form inputs must have accessible labels (WCAG 3.3.2)',
		fixes: [
			{
				title: 'Use Label component',
				description: 'Add proper form label using ADS Label component',
				before: `<Textfield placeholder="Enter your email" />`,
				after: `import { Label } from '@atlaskit/form';
import { Textfield } from '@atlaskit/textfield';

<Label htmlFor="email">Email address</Label>
<Textfield id="email" placeholder="Enter your email" />`,
				explanation: 'Labels create a programmatic association between text and form controls.',
			},
			{
				title: 'Use aria-label for compact layouts',
				description: 'When visual labels cannot be used, add aria-label',
				before: `<Textfield placeholder="Search..." />`,
				after: `<Textfield
  placeholder="Search..."
  aria-label="Search products"
/>`,
				explanation: 'aria-label provides an accessible name when visual labels are not feasible.',
			},
		],
		bestPractices: [
			'Always associate labels with form controls',
			'Use descriptive label text',
			'Prefer visible labels over aria-label',
			'Group related fields with fieldset/legend',
		],
	},
	'heading structure': {
		title: 'Improper Heading Structure',
		description: 'Headings must follow logical hierarchy (WCAG 1.3.1, 2.4.6)',
		fixes: [
			{
				title: 'Use proper heading hierarchy',
				description: 'Structure headings in logical order without skipping levels',
				before: `<h1>Page Title</h1>
<h3>Section Title</h3>
<h2>Another Section</h2>`,
				after: `import { Heading } from '@atlaskit/heading';

<Heading level="h1">Page Title</Heading>
<Heading level="h2">Section Title</Heading>
<Heading level="h3">Subsection Title</Heading>`,
				explanation: 'Logical heading structure helps screen readers understand content hierarchy.',
			},
			{
				title: 'Add section landmarks',
				description: 'Use semantic HTML5 elements for page structure',
				before: `<div>
  <h2>Navigation</h2>
  <div>Main content here</div>
</div>`,
				after: `<main>
  <nav aria-label="Main navigation">
    <Heading level="h2">Navigation</Heading>
  </nav>
  <section>
    <Heading level="h2">Main Content</Heading>
    <div>Main content here</div>
  </section>
</main>`,
				explanation: 'Landmarks provide navigation structure for assistive technologies.',
			},
		],
		bestPractices: [
			'Start with h1 and increment sequentially',
			'Use only one h1 per page',
			'Make headings descriptive',
			'Use landmarks (main, nav, section, aside)',
		],
	},
	'color contrast': {
		title: 'Insufficient Color Contrast',
		description: 'Text must meet minimum contrast ratios (WCAG 1.4.3, 1.4.11)',
		fixes: [
			{
				title: 'Use ADS design tokens',
				description: 'Use design system tokens that meet contrast requirements',
				before: `const styles = css({
  color: '#999999',
  backgroundColor: '#ffffff',
});`,
				after: `import { token } from '@atlaskit/tokens';

const styles = css({
  color: token('color.text'),
  backgroundColor: token('color.background.neutral'),
});`,
				explanation: 'ADS tokens ensure WCAG compliant contrast ratios across all themes.',
			},
			{
				title: 'Use high contrast tokens for better accessibility',
				description: 'Choose high contrast variants when available',
				before: `color: token('color.text.subtle')`,
				after: `color: token('color.text')`,
				explanation: 'Standard text tokens provide better contrast than subtle variants.',
			},
		],
		bestPractices: [
			'Use ADS design tokens',
			'Test with contrast checkers',
			'Minimum 4.5:1 for normal text',
			'Minimum 3:1 for large text and UI components',
		],
	},
	'focus management': {
		title: 'Missing Focus Management',
		description: 'Focus must be visible and properly managed (WCAG 2.4.3, 2.4.7)',
		fixes: [
			{
				title: 'Add focus management to modals',
				description: 'Trap focus within modal dialogs',
				before: `<Modal>
  <div>Modal content</div>
</Modal>`,
				after: `import { Modal, ModalDialog, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<Modal onClose={handleClose}>
  <ModalDialog>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
    </ModalHeader>
    <div>Modal content</div>
  </ModalDialog>
</Modal>`,
				explanation: 'ADS Modal components automatically manage focus trapping and restoration.',
			},
			{
				title: 'Restore focus after actions',
				description: 'Return focus to logical location after destructive actions',
				before: `const handleDelete = () => {
  deleteItem();
  // No focus management
};`,
				after: `const handleDelete = () => {
  deleteItem();
  // Focus previous item or parent container
  const nextFocusTarget = previousElement || parentContainer;
  nextFocusTarget?.focus();
};`,
				explanation: 'Restoring focus helps users maintain their place in the interface.',
			},
		],
		bestPractices: [
			'Ensure focus is always visible',
			'Trap focus in modals and dialogs',
			'Restore focus after modal closes',
			'Provide skip links for keyboard users',
		],
	},
	'link accessibility': {
		title: 'Link Accessibility Issues',
		description: 'Links must have clear purpose and accessible names (WCAG 2.4.4, 2.5.3)',
		fixes: [
			{
				title: 'Make link text descriptive',
				description: 'Avoid generic link text like "click here" or "read more"',
				before: `<Link href="/docs">Click here</Link>`,
				after: `import { Link } from '@atlaskit/link';

<Link href="/docs">View documentation</Link>`,
				explanation: 'Descriptive link text helps users understand where the link leads.',
			},
			{
				title: 'Add context for ambiguous links',
				description: 'Provide additional context using aria-label or surrounding text',
				before: `<Link href="/edit">Edit</Link>`,
				after: `<Link href="/edit" aria-label="Edit user profile">Edit</Link>`,
				explanation:
					'Additional context clarifies the action when link text alone is insufficient.',
			},
		],
		bestPractices: [
			'Use descriptive link text',
			'Avoid "click here" or "read more"',
			'Ensure link purpose is clear from context',
			'Use aria-label for additional context when needed',
		],
	},
	'table accessibility': {
		title: 'Table Accessibility Issues',
		description: 'Tables need proper headers and structure (WCAG 1.3.1)',
		fixes: [
			{
				title: 'Add table headers',
				description: 'Use th elements and scope attributes for table headers',
				before: `<table>
  <tr>
    <td>Name</td>
    <td>Email</td>
  </tr>
</table>`,
				after: `<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
    </tr>
  </tbody>
</table>`,
				explanation: 'Table headers with scope attributes help screen readers navigate table data.',
			},
			{
				title: 'Add table caption',
				description: 'Provide table caption for complex tables',
				before: `<table>
  <thead>...</thead>
</table>`,
				after: `<table>
  <caption>User account information by department</caption>
  <thead>...</thead>
</table>`,
				explanation: "Captions provide context about the table's purpose and structure.",
			},
		],
		bestPractices: [
			'Use th elements for headers',
			'Add scope attributes (col, row)',
			'Provide table captions when helpful',
			'Use thead, tbody, tfoot for structure',
		],
	},
	'error handling': {
		title: 'Inaccessible Error Handling',
		description: 'Errors must be clearly identified and suggested (WCAG 3.3.1, 3.3.3)',
		fixes: [
			{
				title: 'Use ADS form validation',
				description: 'Implement accessible error messages with proper associations',
				before: `<Textfield placeholder="Email" />
<div>Invalid email format</div>`,
				after: `import { ErrorMessage, Field } from '@atlaskit/form';

<Field name="email" label="Email">
  {({ fieldProps, error }) => (
    <>
      <Textfield
        {...fieldProps}
        placeholder="Enter your email"
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
    </>
  )}
</Field>`,
				explanation: 'ADS Form components properly associate errors with form controls.',
			},
			{
				title: 'Announce errors to screen readers',
				description: 'Use live regions to announce dynamic errors',
				before: `const [error, setError] = useState('');
return <div>{error}</div>;`,
				after: `const [error, setError] = useState('');
return (
  <div
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    {error}
  </div>
);`,
				explanation: 'Live regions announce error changes to screen readers immediately.',
			},
		],
		bestPractices: [
			'Associate errors with form controls',
			'Use role="alert" for critical errors',
			'Provide helpful error suggestions',
			'Show errors inline with fields',
		],
	},
	'language identification': {
		title: 'Missing Language Identification',
		description: 'Page and content language must be identified (WCAG 3.1.1, 3.1.2)',
		fixes: [
			{
				title: 'Set page language',
				description: 'Add lang attribute to html element',
				before: `<html>
  <head>...</head>
</html>`,
				after: `<html lang="en">
  <head>...</head>
</html>`,
				explanation: 'The lang attribute helps screen readers pronounce content correctly.',
			},
			{
				title: 'Mark language changes',
				description: 'Identify when content changes language',
				before: `<p>Welcome to our site. Bienvenidos a nuestro sitio.</p>`,
				after: `<p>Welcome to our site. <span lang="es">Bienvenidos a nuestro sitio.</span></p>`,
				explanation: 'Language changes help screen readers switch pronunciation rules.',
			},
		],
		bestPractices: [
			'Set lang attribute on html element',
			'Mark language changes in content',
			'Use valid language codes (en, es, fr, etc.)',
			'Consider regional variants (en-US, en-GB)',
		],
	},
	'touch target size': {
		title: 'Touch Targets Too Small',
		description: 'Touch targets must be at least 24x24 CSS pixels (WCAG 2.5.8)',
		fixes: [
			{
				title: 'Increase button size',
				description: 'Use ADS button variants that meet size requirements',
				before: `<button style={{ padding: '2px 4px' }}>X</button>`,
				after: `import { Button } from '@atlaskit/button';

<Button
  appearance="subtle"
  spacing="compact"
  aria-label="Close"
>
  X
</Button>`,
				explanation: 'ADS buttons automatically meet minimum touch target size requirements.',
			},
			{
				title: 'Add adequate spacing',
				description: 'Ensure sufficient space between interactive elements',
				before: `<div>
  <Button>Save</Button><Button>Cancel</Button>
</div>`,
				after: `import { Stack } from '@atlaskit/stack';

<Stack direction="horizontal" space="space.100">
  <Button>Save</Button>
  <Button>Cancel</Button>
</Stack>`,
				explanation: 'Adequate spacing prevents accidental activation of adjacent controls.',
			},
		],
		bestPractices: [
			'Minimum 24x24 CSS pixels for touch targets',
			'Provide adequate spacing between targets',
			'Use ADS components that meet size requirements',
			'Test on actual devices',
		],
	},
	'motion and animation': {
		title: 'Motion and Animation Issues',
		description: 'Respect user motion preferences (WCAG 2.3.1, 2.2.2)',
		fixes: [
			{
				title: 'Respect reduced motion preference',
				description: 'Disable animations when user prefers reduced motion',
				before: `const styles = css({
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});`,
				after: `const styles = css({
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': {
      transform: 'none',
    },
  },
});`,
				explanation:
					'Respecting motion preferences prevents vestibular disorders and distractions.',
			},
			{
				title: 'Provide controls for auto-playing content',
				description: 'Allow users to pause auto-playing animations',
				before: `<div className="auto-rotating-carousel">
  {/* Auto-rotating content */}
</div>`,
				after: `import { Button } from '@atlaskit/button';

<div>
  <Button onClick={toggleAutoplay}>
    {isPlaying ? 'Pause' : 'Play'} carousel
  </Button>
  <div className={isPlaying ? 'auto-rotating-carousel' : 'static-carousel'}>
    {/* Controllable content */}
  </div>
</div>`,
				explanation: 'User controls prevent motion from interfering with reading or concentration.',
			},
		],
		bestPractices: [
			'Respect prefers-reduced-motion setting',
			'Provide pause controls for auto-playing content',
			'Avoid flashing more than 3 times per second',
			'Make motion optional when possible',
		],
	},
	'live regions': {
		title: 'Missing Live Region Announcements',
		description: 'Dynamic content changes need announcements (WCAG 4.1.3)',
		fixes: [
			{
				title: 'Add status announcements',
				description: 'Announce non-critical status updates',
				before: `const [saved, setSaved] = useState(false);
return saved ? <div>Saved!</div> : null;`,
				after: `const [saved, setSaved] = useState(false);
return saved ? (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    Document saved successfully!
  </div>
) : null;`,
				explanation: 'Status updates are announced to screen readers without interrupting.',
			},
			{
				title: 'Use alert for critical messages',
				description: 'Immediately announce critical information',
				before: `const [error, setError] = useState('');
return error ? <div>{error}</div> : null;`,
				after: `const [error, setError] = useState('');
return error ? (
  <div
    role="alert"
    aria-live="assertive"
  >
    {error}
  </div>
) : null;`,
				explanation: 'Alerts immediately interrupt screen readers for critical information.',
			},
		],
		bestPractices: [
			'Use role="status" for non-critical updates',
			'Use role="alert" for critical messages',
			'Keep announcements concise and clear',
			'Test with screen readers',
		],
	},
	'skip navigation': {
		title: 'Missing Skip Navigation',
		description: 'Provide bypass mechanisms for repetitive content (WCAG 2.4.1)',
		fixes: [
			{
				title: 'Add skip to main content link',
				description: 'Provide skip link to main content area',
				before: `<nav>
  <ul><!-- navigation items --></ul>
</nav>
<main><!-- main content --></main>`,
				after: `import { SkipLinks, SkipLinksItem } from '@atlaskit/skip-links';

<SkipLinks>
  <SkipLinksItem href="#main-content">
    Skip to main content
  </SkipLinksItem>
</SkipLinks>
<nav>
  <ul><!-- navigation items --></ul>
</nav>
<main id="main-content"><!-- main content --></main>`,
				explanation: 'Skip links allow keyboard users to bypass repetitive navigation.',
			},
			{
				title: 'Add multiple skip options',
				description: 'Provide skip links for different page sections',
				before: `<header><!-- header content --></header>
<nav><!-- navigation --></nav>
<main><!-- main content --></main>`,
				after: `<SkipLinks>
  <SkipLinksItem href="#main-content">
    Skip to main content
  </SkipLinksItem>
  <SkipLinksItem href="#navigation">
    Skip to navigation
  </SkipLinksItem>
</SkipLinks>
<header><!-- header content --></header>
<nav id="navigation"><!-- navigation --></nav>
<main id="main-content"><!-- main content --></main>`,
				explanation: 'Multiple skip options provide flexibility for different user needs.',
			},
		],
		bestPractices: [
			'Provide skip to main content link',
			'Make skip links visible when focused',
			'Use descriptive skip link text',
			'Test skip links with keyboard navigation',
		],
	},
	'page titles': {
		title: 'Missing or Poor Page Titles',
		description: 'Pages must have descriptive titles (WCAG 2.4.2)',
		fixes: [
			{
				title: 'Add descriptive page titles',
				description: 'Use clear, unique titles that describe page content',
				before: `<title>Page</title>`,
				after: `<title>User Profile Settings - MyApp</title>`,
				explanation: 'Descriptive titles help users understand their current location.',
			},
			{
				title: 'Update titles dynamically',
				description: 'Change titles based on current page state',
				before: `// Static title only
<title>Dashboard</title>`,
				after: `// Dynamic title updates
useEffect(() => {
  document.title = error
    ? \`Error - Dashboard - MyApp\`
    : \`Dashboard - MyApp\`;
}, [error]);`,
				explanation: 'Dynamic titles reflect current page state and context.',
			},
		],
		bestPractices: [
			'Use unique titles for each page',
			'Put most specific information first',
			'Include site name at the end',
			'Update titles for single-page apps',
		],
	},
};
