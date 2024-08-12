import type { DocNode } from '@atlaskit/adf-schema';
import type { VisitorCollection } from '@atlaskit/adf-utils/src/types';
import { traverse } from '@atlaskit/adf-utils/traverse';

import { type NodeViewDataProvider, type ReceivableNode } from './index';

/**
 * Builds caches for {@link NodeViewDataProvider}s.
 *
 * It will traverse the document and call the resolve method for each node.
 * When all promises are resolved, NodeViewDataProviders will have their caches populated.
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
 *  nodeViewDataProviders: [nodeViewDataProvider1, nodeViewDataProvider2],
 *  signal: AbortSignal.timeout(5000),
 * });
 *
 * const { preset } = usePreset(() =>
 *    new EditorPresetBuilder()
 *      // ...
 *      .add([editorPlugin1, { nodeViewDataProvider: nodeViewDataProvider1 }])
 *      .add([editorPlugin2, { nodeViewDataProvider: nodeViewDataProvider2 }])
 * );
 * ```
 *
 * ### Using caches
 *
 * To make use of a cache in another provider (ie. for a cache created on the server), you can retrieve the cache
 * from the provider and pass it to the new provider.
 *
 * @example
 * ```tsx
 * const provider1 = new ExampleNodeViewDataProvider();
 * await buildCaches({adf, nodeViewDataProviders: [nodeViewDataProvider1]})
 * provider1.cache // { 'key': 'value' }
 *
 * const provider2 = new ExampleNodeViewDataProvider({existingCache: provider1.cache});
 * ```
 */
export async function buildCaches({
	adf,
	nodeViewDataProviders,
	signal,
}: {
	adf: DocNode;
	/**
	 * Providers to build caches for
	 */
	// Build caches does not need to know the type of the providers, so we use any here.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	nodeViewDataProviders: NodeViewDataProvider<any, any>[];
	/**
	 * Signal to abort cache building -- the caches will be built up to the point of abort.
	 */
	signal?: AbortSignal;
}): Promise<void> {
	let visitors = {} as VisitorCollection;

	let promises: Promise<unknown>[] = [];
	for (const nodeViewDataProvider of nodeViewDataProviders) {
		visitors[nodeViewDataProvider.nodeName] = (node) => {
			// We need to cast the node to ReceivableNode as the type is not compatible due to not all nodes having
			// attrs.
			// Providers are only supported for nodes that have attrs.
			const promise = nodeViewDataProvider.resolve(node as ReceivableNode, {
				signal,
			});
			promises.push(promise);
			promise.then((resolvedValue) => {
				const signalAborted = signal ? signal.aborted : false;
				if (!signalAborted) {
					nodeViewDataProvider.cache[nodeViewDataProvider.nodeToKey(node as ReceivableNode)] =
						resolvedValue;
				}
			});

			return undefined;
		};
	}

	traverse(adf, visitors);

	await Promise.all(promises);
}
