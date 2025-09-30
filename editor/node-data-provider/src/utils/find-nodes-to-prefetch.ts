import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';

import type { NodeDataProvider } from '../node-data-provider';

interface ProviderWithNodes {
	/** The nodes that are supported by the provider. */
	nodes: JSONNode[];
	/** The provider that supports the nodes. */
	provider: NodeDataProvider<JSONNode, unknown>;
}

/**
 * Finds nodes in the document that are supported by the given providers, up to a maximum number of nodes.
 * Uses iterative Depth-First Search (DFS) to traverse the document.
 *
 * @param doc The document to search for nodes.
 * @param providers An array of providers with their maximum nodes to prefetch.
 * @param maxNodesToVisit The maximum number of nodes to visit in the document.
 * @returns An array of objects, each containing a provider and the nodes that are supported by that provider.
 */
export function findNodesToPrefetch(
	doc: JSONDocNode,
	providers: {
		maxNodesToPrefetch: number;
		provider: NodeDataProvider<JSONNode, unknown>;
	}[],
	maxNodesToVisit: number,
): ProviderWithNodes[] {
	// Counter for the total number of visited nodes to limit the traversal.
	let totalVisitedNodesCount = 0;
	// A map to store the results, with the provider name as the key.
	const resultMap = providers.reduce<Record<string, ProviderWithNodes>>((acc, { provider }) => {
		acc[provider.name] = {
			provider,
			nodes: [],
		};

		return acc;
	}, {});

	// It doesn't use `filter` function from `@atlaskit/adf-utils/traverse` because it does not support early stopping.
	// We need to stop traversing when we reach the maximum number of nodes to visit to support large documents.

	// Create a list of providers for which we still need to find nodes.
	const providersToLookup = providers
		.filter(({ maxNodesToPrefetch }) => maxNodesToPrefetch > 0)
		.map(({ provider, maxNodesToPrefetch }) => ({
			provider,
			maxNodesToPrefetch,
			foundNodes: 0, // Counter for nodes found for each provider.
		}));

	// Stack for the depth-first search (DFS), starting with the root document node.
	const nodesToVisit: JSONNode[] = [doc];

	// The loop continues as long as there are nodes to visit, providers to look for,
	// and the visited nodes limit has not been reached.
	while (
		nodesToVisit.length > 0 &&
		providersToLookup.length > 0 &&
		totalVisitedNodesCount < maxNodesToVisit
	) {
		totalVisitedNodesCount += 1;
		// Pop from the end to maintain DFS order (LIFO - Last In, First Out)
		const currentNode = nodesToVisit.pop();
		if (!currentNode) {
			// This should never happen because of the loop condition, but we check to satisfy TypeScript.
			continue;
		}

		// Using a reverse loop to avoid issues with array mutation (when removing elements).
		for (let i = providersToLookup.length - 1; i >= 0; i--) {
			const providerToFind = providersToLookup[i];

			// Check if the current provider supports this node.
			if (providerToFind.provider.isNodeSupported(currentNode)) {
				// If provider supports the node, add it to the result map.
				resultMap[providerToFind.provider.name].nodes.push(currentNode);
				// Increment the count of found nodes for this provider.
				providerToFind.foundNodes += 1;

				// If the provider has found enough nodes, remove it from the lookup list.
				if (providerToFind.foundNodes >= providerToFind.maxNodesToPrefetch) {
					providersToLookup.splice(i, 1);
				}
			}
		}

		// If the current node has children, add them to the stack in reverse order
		// to maintain left-to-right traversal when popping from the stack,
		// because it's LIFO.
		if (currentNode.content) {
			// Push children in reverse order to maintain correct DFS traversal order
			for (let i = currentNode.content.length - 1; i >= 0; i--) {
				const node = currentNode.content[i];
				if (node) {
					nodesToVisit.push(node);
				}
			}
		}
	}

	// Return an array of the found nodes, grouped by provider.
	return Object.values(resultMap);
}
