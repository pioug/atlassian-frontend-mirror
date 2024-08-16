import React from 'react';

import { type DocNode } from '@atlaskit/adf-schema';

import { type NodeDataProviders, type NodeDataProvidersCache } from '../cache';

import { _resetGlobalNdpCachesContext } from './_global-ndp-caches';
import { useContentNodeDataProvidersSetup } from './_internal-context';

const ContentNodeDataProvidersContext = React.createContext<NodeDataProviders | undefined>(
	undefined,
);

/**
 *
 * @example
 * ```tsx
 * <ContentNodeDataProviders
 * 	contentType="page" contentId="9001"
 * 	adf={doc}
 * 	placeholder={<Spinner />}
 * 	existingProvidersCache={ssrProvidersCache}
 * 	getNodeDataProviders={getPageNodeDataProviders}
 * 	onCacheWarmed={trackCacheWarmed}
 * >
 * 	 <Editor />
 * </ContentNodeDataProviders>
 * ```
 */
export function ContentNodeDataProviders(props: {
	/**
	 * The type of content, this is used to group the resulting providers cache
	 *
	 * Note: Providers Caches are stored in an internal LRU cache, are grouped by content type.
	 */
	// The type limitation here is expected to be removed as support for content types other than 'page' are added.
	contentType: 'page';
	/**
	 * The type of content, this is used to group the resulting providers cache
	 *
	 */
	contentId: string;
	/**
	 * This is optional - when passed the caches in the data providers will be warmed
	 * based on this document.
	 */
	adf?: DocNode;
	/**
	 * This is optional, and supports passing in an existing providers cache.
	 *
	 * An example of this is when you have a server-side rendered providers cache that you want to use on the client.
	 */
	existingProvidersCache?: NodeDataProvidersCache;
	/**
	 * Returns a set of `NodeDataProviders` which are put in context for use when creating an editor or renderer.
	 * These will be pre-warmed if adf is passed in.
	 */
	getNodeDataProviders: () => NodeDataProviders;
	/**
	 * Called when the cache is warmed.
	 */
	onCacheWarmed?: (_: {
		warmedNodeDataProvidersCache: NodeDataProvidersCache;
		nodeDataProviders: NodeDataProviders;
	}) => void;

	children: React.ReactNode;
}) {
	const contentNodeDataProviders = useContentNodeDataProvidersSetup(
		{ contentType: props.contentType, contentId: props.contentId },
		{
			adfToUpdateWith: props.adf,
			existingProvidersCache: props.existingProvidersCache,
			getNodeDataProviders: props.getNodeDataProviders,
			onCacheWarmed: props.onCacheWarmed,
		},
	);

	return (
		<ContentNodeDataProvidersContext.Provider value={contentNodeDataProviders}>
			{props.children}
		</ContentNodeDataProvidersContext.Provider>
	);
}

export function useContentNodeDataProviders() {
	const contentNodeDataProvidersContext = React.useContext(ContentNodeDataProvidersContext);

	return contentNodeDataProvidersContext;
}

export {
	/**
	 * Exported for testing purposes only.
	 *
	 * This API will change.
	 */
	_resetGlobalNdpCachesContext as __testOnly_resetGlobalNdpCachesContext,
};
