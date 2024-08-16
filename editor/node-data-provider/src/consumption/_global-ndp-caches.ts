import React from 'react';

import { type NodeDataProviders } from '../cache';

import { type LRUCache } from './_lru-cache';

type GlobalNdpCachesContextValue = {
	[contentType: string]: LRUCache<NodeDataProviders>;
};

let GlobalNdpCachesContext = React.createContext<GlobalNdpCachesContextValue>({});

export function useGlobalNdpCachesContext() {
	const globalNdpCachesContextValue = React.useContext(GlobalNdpCachesContext);

	return globalNdpCachesContextValue;
}

// The ndp caches currently use module scope to store the caches. This is not ideal, and a global provider
// will avoid the need for this.
// This function is used to reset the global ndp caches context in tests.
export function _resetGlobalNdpCachesContext() {
	GlobalNdpCachesContext = React.createContext<GlobalNdpCachesContextValue>({});
}
