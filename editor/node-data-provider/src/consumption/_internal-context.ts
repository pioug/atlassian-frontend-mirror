import React from 'react';

import { type DocNode } from '@atlaskit/adf-schema';

import { buildCaches, type NodeDataProviders, type NodeDataProvidersCache } from '../cache';

import { useGlobalNdpCachesContext } from './_global-ndp-caches';
import { LRUCache } from './_lru-cache';

/**
 * The settings for the data providers lru cache,
 * increasing the value will increase the number of data providers that can be stored in the cache.
 */
const lruCacheSettings = {
	page: 5,
	default: 1,
};

/**
 * Sets up nodeview data providers for a content node.
 *
 * This will return the cached node data providers if they exist, otherwise it will call the provided getNodeDataProviders function.
 *
 * Note: Calling this has side effects where caches for the nodeview data providers will continue to be built
 * in the background after this resolves to a set of nodeview data providers that can be used.
 */
export function useContentNodeDataProvidersSetup(
	content: {
		/**
		 * The type of content.
		 */
		// The type limitation here is expected to be removed as support for content types other than 'page' are added.
		contentType: 'page';
		contentId: string;
	},
	/**
	 * Note: changes to this object will not be reflected in the cache.
	 */
	setupOptions: {
		/**
		 * Note: this will only be used if no existing NodeDataProviders are found for the content.
		 */
		adfToUpdateWith?: DocNode;
		existingProvidersCache?: NodeDataProvidersCache;
		getNodeDataProviders: () => NodeDataProviders;
		onCacheWarmed?: (_: {
			warmedNodeDataProvidersCache: NodeDataProvidersCache;
			nodeDataProviders: NodeDataProviders;
		}) => void;
	},
) {
	const _globalNdpCachesContextValue = useGlobalNdpCachesContext();
	// Create a cache for the content type if it doesn't exist
	// While this will not result in any existing context consumers getting the updated value.
	// It will ensure that the cache is available for future consumers.
	if (_globalNdpCachesContextValue[content.contentType] === undefined) {
		_globalNdpCachesContextValue[content.contentType] = new LRUCache(
			lruCacheSettings[content.contentType] ?? lruCacheSettings.default,
		);
	}
	const contentTypeNdpCaches = _globalNdpCachesContextValue[content.contentType];

	// The node data providers should only be rebuilt if the content changes
	// to avoid unnecessary rebuilding of the cache.
	// useRef is used over useMemo as use memo is not a guarantee that the value will be reused
	// - in development it can be called twice
	// - react have made clear that in future versions useMemo may add features that throw away the cache, and [recommend refs](https://react.dev/reference/react/useMemo#caveats) for this use case.
	const currentContentKey = `${content.contentType}-${content.contentId}`;
	const contentKeyRef = React.useRef<string>();
	const nodeDataProvidersRef = React.useRef<NodeDataProviders>();

	if (contentKeyRef.current !== currentContentKey) {
		contentKeyRef.current = currentContentKey;
		const cachedContentNdps = contentTypeNdpCaches?.get(content.contentId);

		let nodeDataProviders = cachedContentNdps || setupOptions.getNodeDataProviders();

		/**
		 * Note: while this will remove old NodeDataProviders from the cache -- these are passed directly to consumers,
		 * so removing from the cache will not result in actively used NodeDataProviders being deleted in some way.
		 *
		 */
		contentTypeNdpCaches.set(content.contentId, nodeDataProviders);

		buildCaches({
			adf: setupOptions.adfToUpdateWith,
			nodeDataProviders: nodeDataProviders,
			existingProvidersCache: setupOptions.existingProvidersCache,
		}).then((warmedNodeDataProvidersCache) => {
			setupOptions.onCacheWarmed?.({
				warmedNodeDataProvidersCache,
				nodeDataProviders,
			});
		});

		nodeDataProvidersRef.current = nodeDataProviders;
	}

	return nodeDataProvidersRef.current;
}
