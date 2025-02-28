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
snapshot(LazyLoadingWithDisplayTextWithOnePluginExample);
snapshot(LazyLoadingWithDisplayTextWithPluginsExample);

snapshot(LazyLoadingWithoutDisplayTextExample);
snapshot(LazyLoadingWithoutDisplayTextWithOnePluginExample);
snapshot(LazyLoadingWithoutDisplayTextWithPluginsExample);
snapshot(LazyLoadingEditModeWithDisplayTextWithPluginsExample);
