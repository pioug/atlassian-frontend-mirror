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
	VrWithLimitedRecentSearchesExample,
	VrWithoutEmptyResultsIllustrationExample,
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
});

snapshot(WithCancelExample, {
	...allVariantsOptions,
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
});

snapshot(PluginErrorExample, {
	...allVariantsOptions,
});

snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
});

/** Width examples */
snapshot(DisableWidthExample);
snapshot(DisableWidthWithPluginsExample, {
	featureFlags: {
		'platform-linking-link-picker-previewable-only': true,
	},
});
snapshot(DisableWidth500Example);
snapshot(DisableWidth500ExampleWithPlugins, {
	featureFlags: {
		'platform-linking-link-picker-previewable-only': true,
	},
});
snapshot(DisableWidth300Example);
snapshot(DisableWidth300ExampleWithPlugins, {
	featureFlags: {
		'platform-linking-link-picker-previewable-only': true,
	},
});

/** Padding examples */
snapshot(ZeroPaddingExample, {
	featureFlags: {
		'platform-linking-link-picker-previewable-only': true,
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
		'platform-linking-link-picker-previewable-only': true,
	},
});

snapshot(VaryingPaddingsExample, {
	featureFlags: {
		'platform-linking-link-picker-previewable-only': true,
	},
});

/** Custom empty state */
snapshot(CustomEmptyStateExample);
snapshot(CustomEmptyStateWithAdaptiveHeightExample);
snapshot(VrWithoutEmptyResultsIllustrationExample, {
	featureFlags: {
		aifc_create_enabled: true,
	},
});
snapshot(VrWithLimitedRecentSearchesExample, {
	featureFlags: {
		aifc_create_enabled: true,
		'platform-linking-link-picker-previewable-only': true,
	},
});
