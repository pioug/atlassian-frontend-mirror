/**
 * Creates headers object with X-Query-Context header if cloudId is provided.
 * Use this for AGG client makeGraphQLRequest calls.
 */
export function createQueryContextHeaders(cloudId?: string): Record<string, string> | undefined {
	if (!cloudId) {
		return undefined;
	}

	return {
		'X-Query-Context': `ari:cloud:platform::site/${cloudId}`,
	};
}
