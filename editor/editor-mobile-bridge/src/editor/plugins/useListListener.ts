import { toNativeBridge } from '../web-to-native';
import { useListener } from './useListener';
import { useRef } from 'react';
import isEqual from 'lodash/isEqual';
import type { ListState } from '@atlaskit/editor-plugin-list';
import type WebBridgeImpl from '../native-to-web';
import { valueOf as valueOfListState } from '../web-to-native/listState';

export const useListListener = (listState: ListState | undefined, bridge: WebBridgeImpl) => {
	const { decorationSet, ...initialListState } = listState ?? {};
	const prevListState = useRef(initialListState);

	useListener(
		() => {
			if (listState === undefined) {
				return;
			}

			const { decorationSet, ...newListState } = listState;

			if (isEqual(prevListState.current, newListState)) {
				return;
			}
			prevListState.current = newListState;

			toNativeBridge.call('listBridge', 'updateListState', {
				states: JSON.stringify(valueOfListState(listState)),
			});
		},
		[listState],
		{ bridge, key: 'listBridgeState', state: listState ?? null },
	);
};
