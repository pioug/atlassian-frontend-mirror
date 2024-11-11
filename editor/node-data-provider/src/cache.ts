import type { DocNode } from '@atlaskit/adf-schema';
import { traverse } from '@atlaskit/adf-utils/traverse';
import type { VisitorCollection } from '@atlaskit/adf-utils/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type ContentNodeDataProviders } from './consumption/content';
import { type AnyNodeDataProvider } from './internal-types';
import { type EmojiNodeDataProvider } from './providers/emoji';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeDataProvidersCache = { [nodeName: string]: Record<string, any> };

export type NodeDataProviders = {
	// Note: when adding new providers - their type needs to be registered here for type safety on consumption.
	emoji: EmojiNodeDataProvider;
	[nodeName: string]: AnyNodeDataProvider;
};

/**
 * Builds {@link NodeDataProvider}s caches for a document.
 *
 * It will traverse the document and call the resolve method for each node.
 * When all promises are resolved, NodeDataProviders will have their caches populated.
 *
 * The providers will then be ready for use with an Editor.
 *
 * To limit the time spent building the cache, a signal can be provided to abort the request.
 *
 * ## Usage
 *
 * @example
 * ```ts
 * buildCaches({
 *  adf: doc,
 *  nodeDataProviders: { emoji: emojiNodeDataProvider, ... },
 *  signal: AbortSignal.timeout(5000),
 * });
 * ```
 *
 * ### Using caches
 *
 * To make use of a cache in another provider (ie. for a cache created on the server), you can retrieve the cache
 * from the provider and pass it to the new provider.
 *
 * @example
 * ```tsx
 * // SSR env
 * const ssrProvidersCaches = await buildCaches({adf, nodeDataProviders: { emoji }})
 *
 * // Client env (providersCaches is the cache from the server)
 * <ContentNodeDataProviders ... existingProvidersCache={ssrProvidersCaches} />
 * ```
 *
 * *Note:* On the client - buildCache is not expected to be used directly.
 *
 * @see {@link ContentNodeDataProviders} for expected client usage.
 */
export async function buildCaches({
	adf,
	nodeDataProviders,
	signal = new AbortController().signal,
	existingProvidersCache,
}: {
	adf?: DocNode;
	/**
	 * Providers to build caches for
	 */
	nodeDataProviders: NodeDataProviders;
	/**
	 * Signal to abort cache building -- the caches will be built up to the point of abort.
	 */
	signal?: AbortSignal;
	existingProvidersCache?: NodeDataProvidersCache;
}): Promise<NodeDataProvidersCache> {
	let visitors = {} as VisitorCollection;

	let promises: Promise<Record<string, unknown> | undefined>[] = [];
	for (const _nodeDataProvider of Object.values(nodeDataProviders)) {
		// widen type to avoid typescript errors with the specific node data provider types
		const nodeDataProvider = _nodeDataProvider as AnyNodeDataProvider;

		if (existingProvidersCache && existingProvidersCache[nodeDataProvider.nodeName]) {
			nodeDataProvider.updateCache(existingProvidersCache[nodeDataProvider.nodeName], {
				strategy: 'merge-override',
			});
		}

		visitors[nodeDataProvider.nodeName] = (node) => {
			const result = nodeDataProvider.get(node, {
				signal,
			});

			if (!isPromise(result)) {
				nodeDataProvider.cache[nodeDataProvider.nodeToKey(node)] = result;
				return;
			}

			promises.push(result);
			result.then((resolvedValue) => {
				const signalAborted = signal ? signal.aborted : false;
				if (!signalAborted && resolvedValue !== undefined) {
					nodeDataProvider.cache[nodeDataProvider.nodeToKey(node)] = resolvedValue;
				}
			});

			return undefined;
		};
	}

	if (adf) {
		traverse(adf, visitors);

		await Promise.all(promises);
	} else {
		await Promise.resolve();
	}

	const caches: NodeDataProvidersCache = {};
	for (const nodeDataProvider of Object.values(nodeDataProviders)) {
		caches[nodeDataProvider.nodeName] = nodeDataProvider.cache;
	}

	return caches;
}

function isPromise<T>(obj: Promise<T | undefined> | T): obj is Promise<T | undefined> {
	return (
		!!obj &&
		(typeof obj === 'object' || typeof obj === 'function') &&
		// @ts-ignore
		typeof obj.then === 'function'
	);
}
