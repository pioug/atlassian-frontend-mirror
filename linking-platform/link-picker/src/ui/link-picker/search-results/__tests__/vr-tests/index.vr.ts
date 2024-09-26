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

snapshot(DefaultExample, options);
snapshot(DefaultAdaptiveHeightExample, options);
snapshot(LoadingPlugins, options);
snapshot(LoadingPluginsWithAdaptiveHeight, options);
snapshot(NoResults, options);
snapshot(NoResultsAdaptive, options);
snapshot(ErrorExample, options);
snapshot(LoadingResultsWithTabs, options);
snapshot(LoadingResultsWithTabsAdaptive, options);
snapshot(ShowingResultsWhileLoadingResults, options);
