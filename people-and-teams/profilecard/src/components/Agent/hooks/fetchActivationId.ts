import { GRAPHQL_ENDPOINT } from './duplicateFetch';

/**
 * Fetches the Rovo activation ID for a given cloud ID.
 * Used to construct the agent ARI when not available.
 */
export const fetchActivationId = async (cloudId: string): Promise<string | null> => {
	try {
		const response = await fetch(GRAPHQL_ENDPOINT, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: `query profilecardActivationQuery($cloudId: ID!, $product: String!) {
					tenantContexts(cloudIds: [$cloudId]) {
						activationIdByProduct(product: $product) {
							active
						}
					}
				}`,
				variables: { cloudId, product: 'rovo' },
			}),
		});
		const json = await response.json();
		return json?.data?.tenantContexts?.[0]?.activationIdByProduct?.active ?? null;
	} catch {
		return null;
	}
};
