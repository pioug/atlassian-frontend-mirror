import { snapshot } from '@af/visual-regression';

import {
	LazyLoadingEditModeWithDisplayTextWithPluginsExample,
	LazyLoadingWithDisplayTextExample,
	LazyLoadingWithDisplayTextWithOnePluginExample,
	LazyLoadingWithDisplayTextWithPluginsExample,
	LazyLoadingWithoutDisplayTextExample,
	LazyLoadingWithoutDisplayTextWithOnePluginExample,
	LazyLoadingWithoutDisplayTextWithPluginsExample,
} from '../../examples';

snapshot(LazyLoadingWithDisplayTextExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LazyLoadingWithDisplayTextWithOnePluginExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LazyLoadingWithDisplayTextWithPluginsExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});

snapshot(LazyLoadingWithoutDisplayTextExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LazyLoadingWithoutDisplayTextWithOnePluginExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LazyLoadingWithoutDisplayTextWithPluginsExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
snapshot(LazyLoadingEditModeWithDisplayTextWithPluginsExample, {
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
