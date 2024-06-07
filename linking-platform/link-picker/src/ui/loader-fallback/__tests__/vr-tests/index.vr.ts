import { snapshot } from '@af/visual-regression';

import {
	LazyLoadingWithDisplayTextExample,
	LazyLoadingWithDisplayTextWithOnePluginExample,
	LazyLoadingWithDisplayTextWithPluginsExample,
	LazyLoadingWithoutDisplayTextExample,
	LazyLoadingWithoutDisplayTextWithOnePluginExample,
	LazyLoadingWithoutDisplayTextWithPluginsExample,
} from '../../examples';

snapshot(LazyLoadingWithDisplayTextExample, {
	featureFlags: {
		'platform.linking-platform.link-picker.fixed-height-search-results': [true, false],
	},
});
snapshot(LazyLoadingWithDisplayTextWithOnePluginExample, {
	featureFlags: {
		'platform.linking-platform.link-picker.fixed-height-search-results': [true, false],
	},
});
snapshot(LazyLoadingWithDisplayTextWithPluginsExample, {
	featureFlags: {
		'platform.linking-platform.link-picker.fixed-height-search-results': [true, false],
	},
});

snapshot(LazyLoadingWithoutDisplayTextExample, {
	featureFlags: {
		'platform.linking-platform.link-picker.fixed-height-search-results': [true, false],
	},
});
snapshot(LazyLoadingWithoutDisplayTextWithOnePluginExample, {
	featureFlags: {
		'platform.linking-platform.link-picker.fixed-height-search-results': [true, false],
	},
});
snapshot(LazyLoadingWithoutDisplayTextWithPluginsExample, {
	featureFlags: {
		'platform.linking-platform.link-picker.fixed-height-search-results': [true, false],
	},
});
