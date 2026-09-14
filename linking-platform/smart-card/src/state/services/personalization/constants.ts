export const personalizationConstants: {
	BASE_URL: string;
	PERSONALIZATION_PROVIDER_PCT_TTL_MS: number;
	PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX: string;
	PERSONALIZATION_STORAGE_SCOPE: string;
	SOCIAL_PROOF_TRAIT_NAME: string;
} = {
	BASE_URL: '/gateway/api/tap-delivery/api/v3/personalization',
	PERSONALIZATION_STORAGE_SCOPE: 'smart-card-social-proof',
	PERSONALIZATION_STORAGE_ITEM_KEY_PREFIX: 'pct-map:v1:',
	PERSONALIZATION_PROVIDER_PCT_TTL_MS: 24 * 60 * 60 * 1000,
	SOCIAL_PROOF_TRAIT_NAME: 'sl_3p_connected_providers_site_pct',
};
