import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { expandPlugin as legacyExpandPlugin } from './legacyExpand/plugin';
import { expandPlugin as singlePlayerExpandPlugin } from './singlePlayerExpand/plugin';
import type { ExpandPlugin } from './types';

// Ignored via go/ees005
// eslint-disable-next-line prefer-const
export let expandPlugin: ExpandPlugin = ({ config: options = {}, api }) => {
	if (options?.__livePage) {
		return singlePlayerExpandPlugin({ config: options, api });
	} else {
		if (expValEquals('platform_editor_single_player_expand', 'isEnabled', true)) {
			return singlePlayerExpandPlugin({ config: options, api });
		} else {
			return legacyExpandPlugin({ config: options, api });
		}
	}
};
