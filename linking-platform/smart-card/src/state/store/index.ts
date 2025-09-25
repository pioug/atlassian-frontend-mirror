import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

export type { CardType } from '@atlaskit/linking-common';

const PENDING_STATE = {
	status: 'pending',
};

export function useSmartCardState(url: string, placeholderData?: CardState): CardState {
	const { store } = useSmartLinkContext();

	const cardState = useSyncExternalStoreWithSelector(
		store.subscribe,
		store.getState,
		store.getState,
		(state) => state[url],
	);

	if (fg('platform_initial_data_for_smart_cards')) {
		return cardState?.status !== 'resolved' && placeholderData
			? placeholderData
			: (cardState ?? PENDING_STATE);
	}
	return cardState ?? PENDING_STATE;
}
