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
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(DefaultExample, {
	...options,
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(DefaultAdaptiveHeightExample, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LoadingPlugins, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LoadingPluginsWithAdaptiveHeight, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(NoResults, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(NoResultsAdaptive, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(ErrorExample, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(ErrorExample, {
	...options,
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LoadingResultsWithTabs, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LoadingResultsWithTabsAdaptive, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(ShowingResultsWhileLoadingResults, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
