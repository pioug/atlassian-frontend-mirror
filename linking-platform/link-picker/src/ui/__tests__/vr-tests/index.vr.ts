import { snapshot } from '@af/visual-regression';

import {
	CustomEmptyStateExample,
	CustomEmptyStateWithAdaptiveHeightExample,
	DefaultExample,
	DisableWidth300Example,
	DisableWidth300ExampleWithPlugins,
	DisableWidth500Example,
	DisableWidth500ExampleWithPlugins,
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

snapshot(DefaultExample, {
	...allVariantsOptions,
	featureFlags: {},
});

snapshot(WithCancelExample, {
	...allVariantsOptions,
	featureFlags: {},
});

snapshot(ErrorBoundaryExample, {
	...allVariantsOptions,
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
	featureFlags: {},
});

snapshot(PluginErrorExample, {
	...allVariantsOptions,
	featureFlags: {},
});

snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
	featureFlags: {},
});

/** Width examples */
snapshot(DisableWidthExample, {
	featureFlags: {},
});
snapshot(DisableWidthWithPluginsExample, {
	featureFlags: {},
});
snapshot(DisableWidth500Example, {
	featureFlags: {},
});
snapshot(DisableWidth500ExampleWithPlugins, {
	featureFlags: {},
});
snapshot(DisableWidth300Example, {
	featureFlags: {},
});
snapshot(DisableWidth300ExampleWithPlugins, {
	featureFlags: {},
});

/** Padding examples */
snapshot(ZeroPaddingExample, {
	featureFlags: {},
});
snapshot(LargePaddingUsingTokensExample, {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {},
});

snapshot(VaryingPaddingsExample, {
	featureFlags: {},
});

/** Custom empty state */
snapshot(CustomEmptyStateExample, {
	featureFlags: {},
});
snapshot(CustomEmptyStateWithAdaptiveHeightExample, {
	featureFlags: {},
});
