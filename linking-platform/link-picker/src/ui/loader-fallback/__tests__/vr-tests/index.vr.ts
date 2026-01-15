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

snapshot(LazyLoadingWithDisplayTextExample);
snapshot(LazyLoadingWithDisplayTextWithOnePluginExample, {
	featureFlags: {
		aifc_create_enabled: true,
	},
});
snapshot(LazyLoadingWithDisplayTextWithPluginsExample, {
	featureFlags: {
		aifc_create_enabled: true,
	},
});

snapshot(LazyLoadingWithoutDisplayTextExample);
snapshot(LazyLoadingWithoutDisplayTextWithOnePluginExample, {
	featureFlags: {
		aifc_create_enabled: true,
	},
});
snapshot(LazyLoadingWithoutDisplayTextWithPluginsExample, {
	featureFlags: {
		aifc_create_enabled: true,
	},
});
snapshot(LazyLoadingEditModeWithDisplayTextWithPluginsExample);
