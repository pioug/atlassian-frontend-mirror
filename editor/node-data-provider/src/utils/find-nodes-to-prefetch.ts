import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';

import type { NodeDataProvider } from '../node-data-provider';

interface ProviderWithNodes {
	/** The provider that supports the nodes. */
	provider: NodeDataProvider<JSONNode, unknown>;
	/** The nodes that are supported by the provider. */
	nodes: JSONNode[];
}

/**
 * Finds nodes in the document that are supported by the given providers, up to a maximum number of nodes.
 *
 * @param doc The document to search for nodes.
 * @param providers An array of providers with their maximum nodes to prefetch.
 * @param maxNodesToVisit The maximum number of nodes to visit in the document.
 * @returns An array of objects, each containing a provider and the nodes that are supported by that provider.
 */
export function findNodesToPrefetch(
	doc: JSONDocNode,
	providers: {
		provider: NodeDataProvider<JSONNode, unknown>;
		maxNodesToPrefetch: number;
	}[],
	maxNodesToVisit: number,
): ProviderWithNodes[] {
	let totalVisitedNodesCount = 0;
	const resultMap = providers.reduce<Record<string, ProviderWithNodes>>((acc, { provider }) => {
		acc[provider.name] = {
			provider,
			nodes: [],
		};

		return acc;
	}, {});

	// It doesn't use `filter` function from `@atlaskit/adf-utils/traverse` because it does not support early stopping.
	// We need to stop traversing when we reach the maximum number of nodes to visit to support large documents.

	const providersToLookup = providers
		.filter(({ maxNodesToPrefetch }) => maxNodesToPrefetch > 0)
		.map(({ provider, maxNodesToPrefetch }) => ({
			provider,
			maxNodesToPrefetch,
			foundNodes: 0,
		}));

	const nodesToVisit: JSONNode[] = [doc];
	let currentIndex = 0;
	while (
		currentIndex < nodesToVisit.length &&
		providersToLookup.length > 0 &&
		totalVisitedNodesCount < maxNodesToVisit
	) {
		totalVisitedNodesCount += 1;
		const currentNode = nodesToVisit[currentIndex];
		currentIndex++;

		// Using reverse loop to avoid issues with array mutation
		for (let i = providersToLookup.length - 1; i >= 0; i--) {
			const providerToFind = providersToLookup[i];

			if (providerToFind.provider.isNodeSupported(currentNode)) {
				resultMap[providerToFind.provider.name].nodes.push(currentNode);
				providerToFind.foundNodes += 1;

				if (providerToFind.foundNodes >= providerToFind.maxNodesToPrefetch) {
					providersToLookup.splice(i, 1);
				}
			}
		}

		if (currentNode.content) {
			nodesToVisit.push(
				...currentNode.content.filter((node): node is JSONNode => node !== undefined),
			);
		}
	}

	return Object.values(resultMap);
}
