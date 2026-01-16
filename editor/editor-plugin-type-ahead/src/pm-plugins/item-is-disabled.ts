import { type ExtractInjectionAPI, type TypeAheadItem } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';

import { type TypeAheadPlugin } from '../typeAheadPluginType';

export const itemIsDisabled = (
	item: TypeAheadItem | undefined,
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
): boolean => {
	const isOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
	return isOffline && item?.isDisabledOffline === true;
};
