import { snapshot } from '@af/visual-regression';

import {
	CustomEmptyStateExample,
	CustomEmptyStateWithAdaptiveHeightExample,
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

snapshot(DefaultExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(WithCancelExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
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
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(PluginErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

/** Width examples */
snapshot(DisableWidthExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidthWithPluginsExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidth500Example, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidth300Example, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

/** Padding examples */
snapshot(ZeroPaddingExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
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
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(VaryingPaddingsExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

/** Custom empty state */
snapshot(CustomEmptyStateExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(CustomEmptyStateWithAdaptiveHeightExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
