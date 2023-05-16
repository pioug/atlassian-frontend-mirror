import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { CardState } from '@atlaskit/linking-common';

export type { CardType } from '@atlaskit/linking-common';

const PENDING_STATE = {
  status: 'pending',
};

export function useSmartCardState(url: string): CardState {
  const { store } = useSmartLinkContext();

  const cardState = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getState,
    (state) => state[url],
  );

  return cardState ?? PENDING_STATE;
}
