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
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(DefaultExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-link-picker': [true, false],
	},
});

snapshot(WithCancelExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
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
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});

snapshot(PluginErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(PluginErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-link-picker': [true, false],
	},
});

snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-link-picker': [true, false],
	},
});

/** Width examples */
snapshot(DisableWidthExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(DisableWidthWithPluginsExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(DisableWidth500Example, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(DisableWidth500ExampleWithPlugins, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(DisableWidth300Example, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(DisableWidth300ExampleWithPlugins, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});

/** Padding examples */
snapshot(ZeroPaddingExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
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
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});

snapshot(VaryingPaddingsExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});

/** Custom empty state */
snapshot(CustomEmptyStateExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
snapshot(CustomEmptyStateWithAdaptiveHeightExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
	},
});
