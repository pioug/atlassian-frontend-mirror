import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Represents the SSR data for a single provider.
 * It's a map where each key is a unique node data key and the value is the prefetched data for that node.
 *
 * @example
 * {
 *   'node-id-1': { value: 'some data' },
 *   'node-id-2': { value: 'other data' }
 * }
 */
type SSRData<Data> = { [dataKey: string]: Data };

/**
 * Represents the cached data for a Node Data Provider.
 * Each key is a unique node data key, and the value is an object containing:
 * - `source`: Indicates whether the data was fetched from SSR or the network.
 * - `data`: The actual data, which can be either a resolved value or a Promise.
 *
 * @example
 * {
 *   'node-id-1': { source: 'ssr', data: { value: 'some data' } },
 *   'node-id-2': { source: 'network', data: Promise.resolve({ value: 'other data' }) }
 * }
 */
type CacheData<Data> = Record<
	string,
	{
		source: 'ssr' | 'network';
		data: Data | Promise<Data>;
	}
>;

/**
 * A Node Data Provider is responsible for fetching and caching data associated with specific ProseMirror nodes.
 * It supports a cache-first-then-network strategy, with initial data potentially provided via SSR.
 *
 * @template Node The specific type of JSONNode this provider supports.
 * @template Data The type of data this provider fetches and manages.
 */
export abstract class NodeDataProvider<Node extends JSONNode, Data> {
	private cacheVersion: number;
	private cache: CacheData<Data>;

	/**
	 * A unique name for the provider. Used for identification in SSR.
	 */
	abstract readonly name: string;

	/**
	 * A type guard to check if a given JSONNode is supported by this provider.
	 * Used to ensure that the provider can handle the node type before attempting to fetch data.
	 *
	 * @param node The node to check.
	 * @returns `true` if the node is of the type supported by this provider, otherwise `false`.
	 */
	abstract isNodeSupported(node: JSONNode): node is Node;

	/**
	 * Generates a unique key for a given node to be used for caching.
	 *
	 * @param node The node for which to generate a data key.
	 * @returns A unique string key for the node's data.
	 */
	abstract nodeDataKey(node: Node): string;

	/**
	 * Fetches data for a batch of nodes from the network or another asynchronous source.
	 *
	 * @param nodes An array of nodes for which to fetch data.
	 * @returns A promise that resolves to an array of data corresponding to the input nodes.
	 */
	abstract fetchNodesData(nodes: Node[]): Promise<Data[]>;

	protected constructor() {
		this.cacheVersion = 0;
		this.cache = {};
	}

	/**
	 * Sets the SSR data for the provider.
	 * This pre-populates the cache with data rendered on the server, preventing redundant network requests on the client.
	 * Calling this method will invalidate the existing cache.
	 *
	 * @example
	 * ```
	 * const ssrData = window.__SSR_NODE_DATA__ || {};
	 * nodeDataProvider.setSSRData(ssrData);
	 * ```
	 *
	 * @param ssrData A map of node data keys to their corresponding data.
	 */
	setSSRData(ssrData: SSRData<Data> = {}): void {
		this.cacheVersion++;
		this.cache = Object.entries(ssrData).reduce<CacheData<Data>>((acc, [key, data]) => {
			acc[key] = {
				source: 'ssr',
				data,
			};

			return acc;
		}, {});
	}

	/**
	 * Clears all cached data.
	 * This increments the internal cache version, invalidating any pending network requests.
	 *
	 * @example
	 * ```
	 * function useMyNodeDataProvider(contentId: string) {
	 *  const nodeDataProvider = new MyNodeDataProvider();
	 *
	 *  // Reset the cache when the contentId changes (e.g., when the user navigates to a different page).
	 *  useEffect(() => {
	 *    nodeDataProvider.resetCache();
	 *  }, [contentId]);
	 *
	 *  return nodeDataProvider;
	 * }
	 * ```
	 */
	resetCache(): void {
		this.cacheVersion++;
		this.cache = {};
	}

	/**
	 * Fetches data for a given node using a cache-first-then-network strategy.
	 *
	 * The provided callback may be called multiple times:
	 * 1. Immediately with data from the SSR cache, if available.
	 * 2. Asynchronously with data fetched from the network.
	 *
	 * @example
	 * ```
	 * const nodeDataProvider = new MyNodeDataProvider();
	 *
	 * nodeDataProvider.getData(node, (data) => {
	 * 	console.log('Node data:', data);
	 * });
	 * ```
	 *
	 * @param node The node (or its ProseMirror representation) for which to fetch data.
	 * @param callback The function to call when data is available.
	 */
	getData(node: Node | PMNode, callback: (data: Data) => void): void {
		// Move implementation to a separate async method
		// to keep this method synchronous and avoid async/await in the public API.
		void this.getDataAsync(node, callback);
	}

	private async getDataAsync(node: Node | PMNode, callback: (data: Data) => void): Promise<void> {
		const jsonNode: JSONNode = 'toJSON' in node ? node.toJSON() : node;

		if (!this.isNodeSupported(jsonNode)) {
			// eslint-disable-next-line no-console
			console.error(`The ${this.constructor.name} doesn't support Node ${jsonNode.type}.`);
			return;
		}

		const dataKey = this.nodeDataKey(jsonNode);

		const dataFromCache = this.cache[dataKey];

		if (dataFromCache !== undefined) {
			// If we have the data in the SSR data, we can use it directly
			if (isPromise(dataFromCache.data)) {
				callback(await dataFromCache.data);
			} else {
				callback(dataFromCache.data);
			}

			if (isSSR()) {
				// If we are in SSR, we don't want to fetch the data again, as it is already available in the SSR data
				return;
			}
		}

		// If no data is available in the cache or the data is from the network,
		// we need to fetch it from the network.
		if (dataFromCache?.source !== 'network') {
			// Store the current cache version before making the request,
			// so we can check if the cache has changed while we are waiting for the network response.
			const cacheVersionBeforeRequest = this.cacheVersion;

			const dataPromise = this.fetchNodesData([jsonNode]).then(([value]) => value);
			// Store the promise in the cache to avoid multiple requests for the same data
			this.cache[dataKey] = {
				source: 'network',
				data: dataPromise,
			};

			const data = await dataPromise;
			// We need to call the callback with the data with result even if the cache version has changed,
			// so all promises that are waiting for the data can resolve.
			callback(data);

			// If the cache version has changed, we don't want to use the data from the network
			// because it could be stale data.
			if (cacheVersionBeforeRequest === this.cacheVersion) {
				// Replace promise with the resolved data in the cache
				this.cache[dataKey] = {
					source: 'network',
					data,
				};
			}
		}
	}

	/**
	 * Fetches data for a given node and returns it as a Promise.
	 * This is a convenience wrapper around the `data` method for use with async/await.
	 *
	 * Note: This promise resolves with the *first* available data, which could be from the SSR cache or the network.
	 * It may not provide the most up-to-date data if a network fetch is in progress.
	 *
	 * Note: This method is only for migration purposes. Use {@link getData} in new code instead.
	 *
	 * @private
	 * @deprecated Don't use this method, use {@link getData} method instead.
	 *             This method is only for migration purposes.
	 *
	 * @param node The node (or its ProseMirror representation) for which to fetch data.
	 * @returns A promise that resolves with the node's data.
	 */
	getDataAsPromise_DO_NOT_USE_OUTSIDE_MIGRATIONS(node: Node | PMNode): Promise<Data> {
		return new Promise<Data>((resolve, reject) => {
			try {
				return this.getData(node, resolve);
			} catch (error) {
				reject(error);
			}
		});
	}
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
	return (
		typeof value === 'object' &&
		value !== null &&
		'then' in value &&
		typeof value.then === 'function'
	);
}
