import { snapshot } from '@af/visual-regression';

import {
	CustomEmptyStateExample,
	DefaultExample,
	DisableWidth300Example,
	DisableWidth500Example,
	DisableWidthExample,
	DisableWidthWithPluginsExample,
	ErrorBoundaryExample,
	LargePaddingUsingTokensExample,
	PluginErrorExample,
	UnauthenticatedErrorExample,
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
snapshot(PluginErrorExample, allVariantsOptions);
snapshot(UnauthenticatedErrorExample, allVariantsOptions);

/** Width examples */
snapshot(DisableWidthExample);
snapshot(DisableWidthWithPluginsExample);
snapshot(DisableWidth500Example);
snapshot(DisableWidth300Example);

/** Padding examples */
snapshot(ZeroPaddingExample);
snapshot(LargePaddingUsingTokensExample, {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(VaryingPaddingsExample);

/** Custom empty state */
snapshot(CustomEmptyStateExample, {
	featureFlags: {
		'platform.linking-platform.link-picker.enable-empty-state': [true, false],
	},
});
