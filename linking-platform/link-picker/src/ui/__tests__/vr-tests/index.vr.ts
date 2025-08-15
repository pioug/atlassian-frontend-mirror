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
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

snapshot(WithCancelExample, {
	...allVariantsOptions,
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
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
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

snapshot(PluginErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

/** Width examples */
snapshot(DisableWidthExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(DisableWidthWithPluginsExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(DisableWidth500Example, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(DisableWidth500ExampleWithPlugins, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(DisableWidth300Example, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(DisableWidth300ExampleWithPlugins, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

/** Padding examples */
snapshot(ZeroPaddingExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
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
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

snapshot(VaryingPaddingsExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

/** Custom empty state */
snapshot(CustomEmptyStateExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(CustomEmptyStateWithAdaptiveHeightExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
