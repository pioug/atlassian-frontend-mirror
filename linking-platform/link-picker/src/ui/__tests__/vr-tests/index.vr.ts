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
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DefaultExample, {
	description: 'DefaultExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

snapshot(WithCancelExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(WithCancelExample, {
	...allVariantsOptions,
	description: 'WithCancelExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
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
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

snapshot(ErrorBoundaryExample, {
	description: 'ErrorBoundaryExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
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
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

snapshot(PluginErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(PluginErrorExample, {
	...allVariantsOptions,
	description: 'PluginErrorExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(UnauthenticatedErrorExample, {
	...allVariantsOptions,
	description:
		'UnauthenticatedErrorExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

/** Width examples */
snapshot(DisableWidthExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidthExample, {
	description: 'DisableWidthExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidthWithPluginsExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidthWithPluginsExample, {
	description:
		'DisableWidthWithPluginsExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidth500Example, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidth500Example, {
	description:
		'DisableWidth500Example - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidth300Example, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(DisableWidth300Example, {
	description:
		'DisableWidth300Example - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

/** Padding examples */
snapshot(ZeroPaddingExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(ZeroPaddingExample, {
	description: 'ZeroPaddingExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
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
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LargePaddingUsingTokensExample, {
	description:
		'LargePaddingUsingTokensExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

snapshot(VaryingPaddingsExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(VaryingPaddingsExample, {
	description:
		'VaryingPaddingsExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

/** Custom empty state */
snapshot(CustomEmptyStateExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(CustomEmptyStateExample, {
	description:
		'CustomEmptyStateExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(CustomEmptyStateWithAdaptiveHeightExample, {
	featureFlags: {
		'platform-linking-visual-refresh-v1': true,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

snapshot(CustomEmptyStateWithAdaptiveHeightExample, {
	description:
		'CustomEmptyStateWithAdaptiveHeightExample - OLD remove when cleaning platform-linking-visual-refresh-v1',
	featureFlags: {
		'platform-linking-visual-refresh-v1': false,
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
