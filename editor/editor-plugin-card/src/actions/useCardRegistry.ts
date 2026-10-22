import { useSyncExternalStore } from 'react';

import type { CardPluginActions, CardRegistrations } from '@atlaskit/editor-common/card/types';

const emptySnapshot = () => undefined;
const emptySubscription = () => () => {};

/** Subscribe to resolved card metadata without observing every editor transaction. */
export const useCardRegistry = (
	actions: Pick<CardPluginActions, 'getCardRegistrations' | 'subscribeToCardRegistry'> | undefined,
): CardRegistrations | undefined =>
	useSyncExternalStore(
		actions?.subscribeToCardRegistry ?? emptySubscription,
		actions?.getCardRegistrations ?? emptySnapshot,
		emptySnapshot,
	);
