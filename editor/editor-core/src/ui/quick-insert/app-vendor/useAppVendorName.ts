import { useSyncExternalStore } from 'react';

import { appVendorCache } from './appVendorCache';

const subscribe = (listener: () => void) => {
	appVendorCache.listeners.add(listener);
	return () => {
		appVendorCache.listeners.delete(listener);
	};
};

const getServerSnapshot = () => undefined;

/** Returns the partner name, `null` for unlisted apps, or `undefined` while unknown. */
export const useAppVendorName = (id: string | undefined): string | null | undefined => {
	const getSnapshot = () => {
		const entry = id ? appVendorCache.entries.get(id) : undefined;
		return entry?.status === 'resolved' ? entry.name : undefined;
	};

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
