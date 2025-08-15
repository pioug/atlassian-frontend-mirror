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
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LazyLoadingWithDisplayTextWithOnePluginExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LazyLoadingWithDisplayTextWithPluginsExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});

snapshot(LazyLoadingWithoutDisplayTextExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LazyLoadingWithoutDisplayTextWithOnePluginExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LazyLoadingWithoutDisplayTextWithPluginsExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
snapshot(LazyLoadingEditModeWithDisplayTextWithPluginsExample, {
	featureFlags: {
		'navx-1368-link-picker-a11y-mandatory-states': true,
	},
});
