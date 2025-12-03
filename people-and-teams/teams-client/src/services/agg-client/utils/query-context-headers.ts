import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Creates headers object with X-Query-Context header if cloudId is provided and feature flag is enabled.
 * Use this for AGG client makeGraphQLRequest calls.
 */
export function createQueryContextHeaders(cloudId?: string): Record<string, string> | undefined {
	if (!cloudId || !fg('enable_x_query_context_header')) {
		return undefined;
	}

	return {
		'X-Query-Context': `ari:cloud:platform::site/${cloudId}`,
	};
}
