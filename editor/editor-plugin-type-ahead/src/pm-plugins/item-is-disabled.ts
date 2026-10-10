import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { TypeAheadItem } from '@atlaskit/editor-common/types/type-ahead';

import type { TypeAheadPlugin } from '../typeAheadPluginType';

export const itemIsDisabled = (
	item: TypeAheadItem | undefined,
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
): boolean => {
	const isOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
	return item?.isNonInteractive === true || (isOffline && item?.isDisabledOffline === true);
};
