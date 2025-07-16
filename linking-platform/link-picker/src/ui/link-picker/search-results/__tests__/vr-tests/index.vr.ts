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
	},
});
snapshot(DefaultExample, {
	...options,
	featureFlags: {},
});
snapshot(DefaultAdaptiveHeightExample, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LoadingPlugins, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LoadingPluginsWithAdaptiveHeight, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(NoResults, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(NoResultsAdaptive, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(ErrorExample, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'platform-link-picker-remove-legacy-button': [true, false],
	},
});
snapshot(ErrorExample, {
	...options,
	featureFlags: {
		'platform-link-picker-remove-legacy-button': [true, false],
	},
});
snapshot(LoadingResultsWithTabs, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LoadingResultsWithTabsAdaptive, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(ShowingResultsWhileLoadingResults, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
