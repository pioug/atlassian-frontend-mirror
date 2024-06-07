import { snapshot } from '@af/visual-regression';

import {
	DefaultExample,
	DisableWidth300Example,
	DisableWidth500Example,
	DisableWidthExample,
	DisableWidthWithPluginsExample,
	ErrorBoundaryExample,
	LargePaddingUsingTokensExample,
	VaryingPaddingsExample,
	WithCancelExample,
	ZeroPaddingExample,
} from '../../examples';

type OptionsType = Parameters<typeof snapshot>[1];

const allVariantsOptions: OptionsType = {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
};

snapshot(DefaultExample, allVariantsOptions);
snapshot(WithCancelExample, allVariantsOptions);
snapshot(ErrorBoundaryExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform.linking-platform.link-picker.fixed-height-search-results': [true, false],
	},
	ignoredErrors: [
		{
			pattern: /replace is not a function/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
		{
			pattern: /error occurred in one of your React components/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});

/** Width examples */
snapshot(DisableWidthExample);
snapshot(DisableWidthWithPluginsExample);
snapshot(DisableWidth500Example);
snapshot(DisableWidth300Example);

// /** Padding examples */
snapshot(ZeroPaddingExample);
snapshot(LargePaddingUsingTokensExample, {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
snapshot(VaryingPaddingsExample);
