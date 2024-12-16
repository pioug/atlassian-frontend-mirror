import { type ExtractInjectionAPI, type TypeAheadItem } from '@atlaskit/editor-common/types';

import { type TypeAheadPlugin } from '../typeAheadPluginType';

export const itemIsDisabled = (
	item: TypeAheadItem | undefined,
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
) => {
	const isOffline = api?.connectivity?.sharedState.currentState()?.mode === 'offline';
	return isOffline && item?.isDisabledOffline === true;
};
