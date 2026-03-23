export interface AtlAttributionConfig {
	activationId?: string;
	cloudId: string;
	productId?: string;
}

export function buildAtlAttributionHeaderValue(
	config: AtlAttributionConfig,
): { 'atl-attribution': string } | undefined {
	const { cloudId, activationId, productId = 'platform' } = config;

	const value: Record<string, string> = {
		tenantId: cloudId,
		product: productId,
	};

	if (activationId) {
		value.atlWorkspaceId = `ari:cloud:${productId}:${cloudId}:workspace/${activationId}`;
	}

	return {
		'atl-attribution': JSON.stringify(value),
	};
}
