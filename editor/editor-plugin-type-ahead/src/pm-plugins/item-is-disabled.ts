import type { ExtractInjectionAPI, TypeAheadItem } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { TypeAheadPlugin } from '../typeAheadPluginType';

export const itemIsDisabled = (
	item: TypeAheadItem | undefined,
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
): boolean => {
	const isOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
	return (
		(isExperimentEnabled('platform_editor_mention_search_order') &&
			item?.isNonInteractive === true) ||
		(isOffline && item?.isDisabledOffline === true)
	);
};
