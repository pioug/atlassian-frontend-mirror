/**
 * Utility for creating the atl-attribution header for AGG requests
 * Reference: https://hello.atlassian.net/wiki/spaces/AGG/pages/5954141702/Metrics+Attribution+Onboarding+Doc+for+AGG+Clients
 */

export interface AtlAttributionHeaderData {
	service: string;
	tenantId?: string;
	activationId?: string;
	product?: string;
}

/**
 * Creates the atl-attribution header value for network requests.
 * This header is used for metrics attribution in AGG (Analytics & Insights Graph).
 *
 * @param data Optional attribution data including tenantId, atlWorkspaceId, and product
 * @returns Object with atl-attribution header
 */
export function createAtlAttributionHeader({
	product = 'platform',
	activationId,
	...props
}: Partial<AtlAttributionHeaderData> = {}): {
	'atl-attribution': string;
} {
	const headerData = {
		service: 'smart-experiences/smart-user-picker',
		product,
		atlWorkspaceId:
			activationId && props.tenantId
				? `ari:cloud:${product}:${props.tenantId}:workspace/${activationId}`
				: undefined,
		...props,
	};

	return {
		'atl-attribution': JSON.stringify(headerData),
	};
}
