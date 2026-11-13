import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { interactivityPlugin as currentPlugin } from './interactivityPlugin';
import type { InteractivityPlugin } from './interactivityPluginType';
import { interactivityPlugin as legacyPlugin } from './legacy/interactivityPlugin';

/**
 * Chooses the plugin as the editor creates it.
 *
 * `legacy/` is the plugin as it was before its collector was made independent of the editor,
 * kept unchanged to compare the new one against and to fall back to.
 */
export const interactivityPlugin: InteractivityPlugin = (params) =>
	isExperimentEnabled('platform_editor_interactivity_inp_collector')
		? currentPlugin(params)
		: legacyPlugin(params);
