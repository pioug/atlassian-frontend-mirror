import { GRAPHQL_ENDPOINT } from './duplicateFetch';

/**
 * Fetches version capability for a site via raw GraphQL fetch.
 * Returns true only if versioning migration has completed.
 *
 * TODO remove after versioning rollout complete
 * See: https://product-fabric.atlassian.net/browse/RAGE-2822
 */
export const fetchHasVersionCapability = async (cloudId: string): Promise<boolean> => {
	try {
		const response = await fetch(GRAPHQL_ENDPOINT, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: `query profilecardHasVersionCapabilityQuery($cloudId: String!) {
					agentStudio_hasVersionCapability(cloudId: $cloudId) @optIn(to: "AgentStudio") {
						__typename
						... on AgentStudioHasVersionCapability {
							hasVersionCapability
						}
					}
				}`,
				variables: { cloudId },
			}),
		});
		const json = await response.json();
		const result = json?.data?.agentStudio_hasVersionCapability;
		return result?.__typename === 'AgentStudioHasVersionCapability'
			? Boolean(result.hasVersionCapability)
			: false;
	} catch {
		return false;
	}
};
