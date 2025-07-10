import { snapshot } from '@af/visual-regression';

import {
	DefaultAdaptiveHeightExample,
	DefaultExample,
	ErrorExample,
	LoadingPlugins,
	LoadingPluginsWithAdaptiveHeight,
	LoadingResultsWithTabs,
	LoadingResultsWithTabsAdaptive,
	NoResults,
	NoResultsAdaptive,
	ShowingResultsWhileLoadingResults,
} from '../../examples';

type OptionsType = Parameters<typeof snapshot>[1];

const options: OptionsType = {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
};

snapshot(DefaultExample, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(DefaultExample, {
	...options,
	featureFlags: {
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(DefaultAdaptiveHeightExample, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(LoadingPlugins, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(LoadingPluginsWithAdaptiveHeight, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(NoResults, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(NoResultsAdaptive, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(ErrorExample, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-link-picker-remove-legacy-button': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(ErrorExample, {
	...options,
	featureFlags: {
		'platform-linking-visual-refresh-link-picker': true,
		'platform-link-picker-remove-legacy-button': [true, false],
	},
});
snapshot(LoadingResultsWithTabs, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(LoadingResultsWithTabsAdaptive, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
snapshot(ShowingResultsWhileLoadingResults, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-linking-visual-refresh-link-picker': true,
	},
});
