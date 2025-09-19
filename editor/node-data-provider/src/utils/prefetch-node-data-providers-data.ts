import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';

import type { NodeDataProvider } from '../node-data-provider';

import { findNodesToPrefetch } from './find-nodes-to-prefetch';

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
type SsrData = { [dataKey: string]: unknown };

/**
 * Represents the aggregated SSR data for all node data providers.
 * Each key is a provider's name, and the value contains the fetch status, duration,
 * and a map of node data keys to their prefetched data.
 *
 * @example
 * ```
 * {
 *   mentionProvider: {
 *     success: true,
 *     duration: 220,
 *     data: {
 *       'mention-1': { id: '1', name: 'John Doe' }
 *     }
 *   },
 *   emojiProvider: {
 *     success: true,
 *     duration: 110,
 *     data: {
 *       'emoji-123': { shortName: ':smile:', representation: '😊' }
 *     }
 *   }
 * }
 * ```
 */
type NodeDataProvidersSsrData = {
	[providerName: string]: {
		data: SsrData;
		duration: number;
		success: boolean;
	};
};

interface Props {
	/**
	 * The document for which to prefetch data.
	 */
	doc: JSONDocNode;
	/**
	 * The maximum number of nodes to visit when searching for nodes to prefetch.
	 * This is a performance safeguard for very large documents.
	 *
	 * @default If not specified, the entire document will be traversed.
	 */
	maxNodesToVisit?: number;
	/**
	 * A list of node data providers to use for prefetching, along with their
	 * individual configurations.
	 */
	providers: {
		/**
		 * The maximum number of nodes to prefetch for this specific provider.
		 * This helps prevent performance issues with documents containing many
		 * nodes of the same type.
		 *
		 * @default If not specified, all nodes supported by the provider will be prefetched.
		 */
		maxNodesToPrefetch?: number;
		/**
		 * The provider instance to use for prefetching.
		 */
		provider: NodeDataProvider<JSONNode, unknown>;
		/**
		 * The timeout in milliseconds for the fetch request for this specific provider.
		 * If the request takes longer than this, it will be aborted and return no data.
		 *
		 * @default If not specified, the global timeout will be used.
		 */
		timeout?: number;
	}[];
	/**
	 * A global timeout in milliseconds for all fetch requests.
	 *
	 * Each provider will use the minimum of this value and its own specific timeout.
	 */
	timeout: number;
}

/**
 * Fetches data for nodes in the document that are supported by the given providers.
 * This function will traverse the document and call the `fetchData` method for each node that is supported by the providers.
 *
 * @example
 * ```
 * const doc = JSON.parse('{"type": "doc", "content": [...] }');
 * const providers = [
 *   {
 *     provider: new EditorCardProvider(),
 *  	  maxNodesToPrefetch: 10,
 *  	  timeout: 500,
 *  	},
 *   {
 *     provider: new EditorMentionsProvider(),
 *     maxNodesToPrefetch: 50,
 *  	  timeout: 500,
 *   },
 * ];
 *
 * const data = await prefetchNodeDataProvidersData({
 *   providers,
 *   doc,
 *   timeout: 1_000,
 *   maxNodesToVisit: 2_000
 * });
 * ```
 *
 * @param props The properties for prefetching node data.
 * @returns Record of provider names to their respective SSR data,
 *          success status, and duration of the fetch operation.
 */
export async function prefetchNodeDataProvidersData({
	providers,
	doc,
	timeout,
	maxNodesToVisit = Infinity,
}: Props): Promise<NodeDataProvidersSsrData> {
	if (timeout <= 0) {
		// If the global timeout is 0 or negative, skip fetching entirely.
		return providers.reduce<NodeDataProvidersSsrData>((acc, { provider }) => {
			acc[provider.name] = {
				data: {},
				success: false,
				duration: 0,
			};
			return acc;
		}, {});
	}

	const providersWithDefaults = providers.map(
		({ provider, maxNodesToPrefetch = Infinity, timeout: providerTimeout = Infinity }) => ({
			provider,
			maxNodesToPrefetch,
			// Use the minimum of the global timeout and the provider-specific timeout
			timeout: Math.min(providerTimeout, timeout),
		}),
	);

	const providerTimeouts = providersWithDefaults.reduce(
		(acc, { provider, timeout }) => {
			acc[provider.name] = timeout;
			return acc;
		},
		{} as Record<string, number>,
	);

	const nodesWithProviders = findNodesToPrefetch(doc, providersWithDefaults, maxNodesToVisit).map(
		({ provider, nodes }) => ({
			provider,
			nodes,
			timeout: providerTimeouts[provider.name],
		}),
	);

	interface ProviderResult {
		data: unknown[];
		duration: number;
		nodes: JSONNode[];
		provider: NodeDataProvider<JSONNode, unknown>;
		success: boolean;
	}

	const promises = nodesWithProviders.map<Promise<ProviderResult>>(
		async ({ nodes, provider, timeout }) => {
			if (timeout <= 0) {
				return {
					provider,
					success: false,
					duration: 0,
					nodes,
					data: [],
				};
			}

			const start = performance.now();
			function getDurationFromStart() {
				return Math.min(performance.now() - start, timeout);
			}

			try {
				const timeoutPromise = new Promise<unknown[]>((_, reject) => {
					setTimeout(() => {
						reject();
					}, timeout);
				});

				const data = await Promise.race([provider.fetchNodesData(nodes), timeoutPromise]);

				return {
					provider,
					success: true,
					duration: getDurationFromStart(),
					nodes,
					data,
				};
			} catch {
				return {
					provider,
					success: false,
					duration: getDurationFromStart(),
					nodes,
					data: [],
				};
			}
		},
	);

	const results = await Promise.all(promises);

	return results.reduce<NodeDataProvidersSsrData>(
		(acc, { provider, success, duration, nodes, data }) => {
			const ssrData = data.reduce<SsrData>((providerSsrData, nodeData, nodeIndex) => {
				const node = nodes[nodeIndex];
				const nodeDataKey = provider.nodeDataKey(node);

				providerSsrData[nodeDataKey] = nodeData;

				return providerSsrData;
			}, {});

			acc[provider.name] = {
				data: ssrData,
				success,
				duration,
			};

			return acc;
		},
		{},
	);
}
