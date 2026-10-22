import { useSyncExternalStore } from 'react';

import type { FloatingToolbarConfig } from '@atlaskit/editor-common/types/floating-toolbar';

const emptySnapshot = () => 0;
const emptySubscription = () => () => {};

/** Refresh toolbar content when its optional external store changes. */
export const useToolbarExternalStore = (store: FloatingToolbarConfig['externalStore']): void => {
	useSyncExternalStore(
		store?.subscribe ?? emptySubscription,
		store?.getSnapshot ?? emptySnapshot,
		emptySnapshot,
	);
};
